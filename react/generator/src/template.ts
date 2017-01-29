import {
    Node,
    DomNode,
    ClassToggle,
    EventListener,
    PropGetter,
    Slot,
    ComponentHandler,
    LocalGetter,
    TextNode,
    ComponentTag,
    ForTemplate,
    Attr,
    ComponentCall,
    DomEvent,
    ComponentEvent
} from '../../../core/dist/template_definitions'

const HOST_TAG = "data-ilibhost";

let indent = (str: string): string =>
    str.split('\n').map(l => `    ${l}`).join('\n');

let cap = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export function template(node: Node, componentName: string, components: { [key: string]: { shadowId: string } }): { content: string, usedComponents: string[] } {
    let usedComponents = [];

    let processDomNode = (node: DomNode) => {
        let processNodeTag = (tag: DomNode['tag']): string => {
            if (typeof tag === "string") {
                return tag;
            } else if (tag.type === 'componentTag') {
                usedComponents.push(tag.name);
                return tag.name;
            } else {
                throw unsupported('tag', tag)
            }
        };
        let processNodeAttrs = (attrs: DomNode['attrs']): string => {
            let shadowId = `${HOST_TAG}${<string>components[componentName].shadowId}`
            let classNames = node.attrs
                .filter(attr => attr.type === 'classToggle')
                .map((classToggle: ClassToggle) => {
                    return `(${processGetter(classToggle.state)} ? '${classToggle.name} ' : '')`
                });
            let classString = `className={(this.props.className || '')${classNames.length ? ' + ' : ''}${<string>classNames.join(' + ')}}`
            let attrStrings = node.attrs
                .filter(attr => attr.type !== 'classToggle')
                .map(attr => {
                    switch (attr.type) {
                        case 'attr':
                            let state = processGetter(attr.state);

                            return `${<string>attr.name}={${state}}`;
                        case 'eventListener': 
                            let processEvent = (event: DomEvent|ComponentEvent): string => {
                                if (event.type === 'domEvent') {
                                    return `on${cap(event.name)}`;
                                } else {
                                    return event.name;
                                }
                            };

                            let event = processEvent(attr.event);
                            let handler = processHandler(attr.handler);

                            return `${event}={${handler}}`;
                        default:
                            throw unsupported('attribute', attr)
                    }
                });
            return [shadowId, classString].concat(attrStrings).join('\n');
        };
        let tag = processNodeTag(node.tag);
        let attrs = processNodeAttrs(node.attrs);
        
        return `<${tag}${attrs.length ? `\n${indent(`${attrs}`)}` : ''}>\n` +
               indent(processNodeChildrens(node.childrens)) +
               `\n</${tag}>`;
    };

    let processTextNode = (textNode: TextNode): string => {
        let content = textNode.content;
        switch (content.type) {
            case 'staticValue':
                return content.value;
            case 'localGetter':
                return `{${processGetter(content)}}`;
            default:
                throw unsupported('text node content', content)
        }
    };

    let processSlot = (slot: Slot) => '{ this.props.children }';

    let processFooTemplate = (forTemplate: ForTemplate) => {
        let of = processGetter(forTemplate.of);
        let value = processGetter(forTemplate.value);
        let index = forTemplate.index ? `, ${processGetter(forTemplate.index)}` : ''
        
        return `{ ${of}.map((${value}${index}) => { return (\n` +
               indent(processNodeChildrens(forTemplate.childrens)) + '\n' + 
               '); }) }';
    };

    let processNodeChildrens = (childrens: Node[]): string => {
        return childrens.map((children: DomNode|TextNode|ForTemplate|Slot): string => {
            switch (children.subtype) {
                case 'domNode':
                    return processDomNode(children);
                case 'slot':
                    return processSlot(children);
                case 'textNode':
                    return processTextNode(children);
                case 'forTemplate':
                    return processFooTemplate(children);
                default:
                    throw unsupported('node type', children)
            }
        }).join('\n');
    };

    let processGetter = (getter: PropGetter|LocalGetter|ComponentCall): string => {
        switch (getter.type) {
            case 'propGetter':
                return `this.props.${<string>getter.name}`;
            case 'componentCall':
                let params = getter.params.map((param) => processGetter(param)).join(', ');
                return `this.component.${<string>getter.name}(${params})`;
            case 'localGetter':
                return `${<string>getter.name}`;
            default:
                throw unsupported('getter', getter)
        }
    };

    let processHandler = (handler: EventListener['handler']): string => {
        if (handler.type === 'componentHandler') {
            let paramsString = handler.params.map(param => {
                if (param.type === 'localGetter') {
                    return param.name;
                } else {
                    throw unsupported('handler param', param)
                }
            }).concat('e').join(', ');
            return `(e) => this.component.${<string>handler.name}(${paramsString})`
        } else {
            throw unsupported('event handler', handler)
        }
    };

    return {
        content: processDomNode(node as DomNode),
        usedComponents
    }
}