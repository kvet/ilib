import {
    Node,
    ClassToggle,
    EventListener,
    PropGetter,
    ContentPlaceholder,
    ComponentHandler,
    LocalGetter,
    TextNode,
    ComponentTag,
    ForLoop,
    Attr,
    ComponentCall
} from '../../../core/dist/template_definitions'

let indent = (str: string): string =>
    str.split('\n').map(l => `    ${l}`).join('\n');

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export function template(node: Node, components: { [key: string]: { tag: string, attr?: string } }): { tag: string, rootAttrs: string, content: string, usedComponents: string[] } {
    let usedComponents = [];

    let processNode = (node: Node, additionalAttrs: string[] = []) => {
        let processNodeTag = (tag: Node['tag']): { tag: string, attr?: string } => {
            if (typeof tag === "string") {
                return { tag };
            } else if (tag.type === 'componentTag') {
                usedComponents.push(tag.name);
                return {
                    tag: components[tag.name].tag,
                    attr: components[tag.name].attr
                }
            } else {
                throw unsupported('tag', tag)
            }
        };
        let processNodeAttrs = (attrs: Node['attrs']): string => {
            return additionalAttrs.concat(node.attrs.map(attr => {
                switch (attr.type) {
                    case 'attr':
                        let state = processGetter(attr.state);

                        return `[${<string>attr.name}]="${state}"`;
                    case 'eventListener': 
                        let handler = processHandler(attr.handler);

                        return `(${<string>attr.event.name})="${handler}"`;
                    default:
                        throw unsupported('root attribute', attr)
                }
            })).join('\n');
        };
        let tag = processNodeTag(node.tag);
        let attrs = processNodeAttrs(node.attrs);
        
        return `<${tag.tag}${tag.attr ? ` ${tag.attr}`: ''}${attrs.length ? `\n${indent(`${attrs}`)}` : ''}>\n` +
               indent(processNodeChildrens(node.childrens)) +
               `\n</${tag.tag}>`;
    };

    let processTextNode = (textNode: TextNode): string => {
        let content = textNode.content;
        switch (content.type) {
            case 'staticValue':
                return content.value;
            case 'localGetter':
                return `{{${processGetter(content)}}}`;
            default:
                throw unsupported('text node content', content)
        }
    };

    let processContentPlaceholder = (contentPlaceholder: ContentPlaceholder) => '<ng-content></ng-content>';

    let processForLoop = (forLoop: ForLoop) => {
        let of = processGetter(forLoop.of);
        let value = processGetter(forLoop.value);
        let index = forLoop.index ? `; let ${processGetter(forLoop.index)} = index` : ''
        let ngFor = `*ngFor="let ${value} of component.${of}${index}"`;

        return processNode(forLoop.children, [ngFor]);
    };

    let processNodeChildrens = (childrens: Node['childrens']): string => {
        return childrens.map((children): string => {
            switch (children.type) {
                case 'node':
                    return processNode(children);
                case 'contentPlaceholder':
                    return processContentPlaceholder(children);
                case 'textNode':
                    return processTextNode(children);
                case 'forLoop':
                    return processForLoop(children);
                default:
                    throw unsupported('node type', children)
            }
        }).join('\n');
    };

    let processGetter = (getter: PropGetter|LocalGetter|ComponentCall, withinClass = false): string => {
        switch (getter.type) {
            case 'propGetter':
                return `${withinClass ? 'this.' : ''}${<string>getter.name}`;
            case 'componentCall':
                let params = getter.params.map((param) => processGetter(param, withinClass)).join(', ');
                return `${withinClass ? 'this.' : ''}component.${<string>getter.name}(${params})`;
            case 'localGetter':
            return `${<string>getter.name}`;
            default:
                throw unsupported('getter', getter)
        }
    };

    let processHandler = (handler: EventListener['handler'], withinClass = false): string => {
        if (handler.type === 'componentHandler') {
            let paramsString = handler.params.map(param => {
                if (param.type === 'localGetter') {
                    return param.name;
                } else {
                    throw unsupported('handler param', param)
                }
            }).concat('$event').join(', ');
            return `${withinClass ? 'this.' : ''}component.${<string>handler.name}(${paramsString})`
        } else {
            throw unsupported('revent handler', handler)
        }
    };

    let processRootAttrs = (attrs: Node['attrs']): string => {
        return node.attrs.map(attr => {
            switch (attr.type) {
                case 'classToggle':
                    let state = processGetter(attr.state, true);

                    return `@HostBinding('class.${<string>attr.name}') get _h_${<string>attr.name}() {\n` +
                            `    return ${state};\n` +
                            `}`;
                case 'eventListener': 
                    let handler = processHandler(attr.handler, true);

                    return `@HostListener('${<string>attr.event.name}') _ho_${<string>attr.event.name}($event) {\n` +
                            `    return ${handler};\n` +
                            `}`;
                default:
                    throw unsupported('root attribute', attr)
            }
        }).join('\n');
    };

    return {
        tag: typeof node.tag === 'string' ? node.tag : (() => { throw unsupported('root tag', node.tag) })(),
        rootAttrs: processRootAttrs(node.attrs),
        content: processNodeChildrens(node.childrens),
        usedComponents
    }
}