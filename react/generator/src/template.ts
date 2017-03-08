import {
    Node,
    DomNode,
    Handler,
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
    ComponentEvent,
    Getter,
    StaticValue,
    StateGetter,
    Template,
    TemplateScopeGetter,
    TemplateScopeHandler
} from '../../../core/dist/definitions.template';
import { uniqTag } from './utils';

let indent = (str: string): string =>
    str.split('\n').map(l => `    ${l}`).join('\n');

let cap = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export function template(node: Node, componentName: string): { content: string, usedComponents: string[] } {
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
            let shadowId = uniqTag(componentName);
            let classNames = node.attrs
                .filter(attr => attr.type === 'classToggle')
                .map((classToggle: ClassToggle) => {
                    return `(${processGetter(classToggle.state)} ? '${classToggle.name} ' : '')`
                });
            let classString = `className={(this.props.className || '') + ' '${classNames.length ? ' + ' : ''}${<string>classNames.join(' + ')}}`
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
        if(node.ref) attrs = `ref={(node) => { this._refs['${node.ref}'] = node; }}\n` + attrs;
        
        return `<${tag}${attrs.length ? `\n${indent(`${attrs}`)}` : ''}>\n` +
               indent(processNodeChildrens(node.childrens)) +
               `\n</${tag}>`;
    };

    let processTextNode = (textNode: TextNode): string => {
        return `{${processGetter(textNode.content)}}`;
    };

    let processSlot = (slot: Slot) => '{ this.props.children }';

    let processFooTemplate = (forTemplate: ForTemplate) => {
        let of = processGetter(forTemplate.of);
        let value = processGetter(forTemplate.value);
        let index = forTemplate.index ? `, ${processGetter(forTemplate.index)}` : ''
        
        return `{ ${of}.map((${value}${index}) =>\n` +
               indent(processNodeChildrens(forTemplate.childrens, 'js')) + '\n' + 
               ') }';
    };

    let processTemplate = (template: Template, context: 'js'|'jsx') => {
        let args = '{ ' + Object.keys(template.dataFields).map(name => {
            let meta = template.dataFields[name];
            let value = meta.type === 'getter' ? processGetter(meta) : processHandler(meta);
            return `${name}: ${value}`
        }).join(', ') + ' }';
        let wrapJs = context === 'jsx';

        return `${wrapJs ? '{ ' : ''}(this.props.children && this.props.children.default\n` + 
               `? this.props.children.default\n` +
               `: (data) => \n` +
               indent(processNodeChildrens(template.childrens)) + `\n` +
               `)(${args})${wrapJs ? ' }' : ''}`;
    };

    let processNodeChildrens = (childrens: Node[], context: 'js'|'jsx' = 'jsx'): string => {
        return childrens.map((children: DomNode|TextNode|ForTemplate|Slot|Template): string => {
            switch (children.subtype) {
                case 'domNode':
                    return processDomNode(children);
                case 'slot':
                    return processSlot(children);
                case 'textNode':
                    return processTextNode(children);
                case 'forTemplate':
                    return processFooTemplate(children);
                case 'template':
                    return processTemplate(children, context);
                default:
                    throw unsupported('node type', children)
            }
        }).join('\n');
    };

    let processGetter = (getter: Getter): string => {
        return ((getter: PropGetter|StateGetter|LocalGetter|ComponentCall|StaticValue|TemplateScopeGetter): string => {
            switch (getter.subtype) {
                case 'propGetter':
                    return `this.props.${<string>getter.name}`;
                case 'stateGetter':
                    return `this.state.${<string>getter.name}`;
                case 'componentCall':
                    let params = getter.params.map((param) => processGetter(param)).join(', ');
                    return `this.component.${<string>getter.name}(${params})`;
                case 'localGetter':
                    return `${<string>getter.name}`;
                case 'templateScopeGetter':
                    return `data.${<string>getter.name}`;
                case 'staticValue':
                    return JSON.stringify(getter.value);
                default:
                    throw unsupported('getter', getter)
            }
        })(getter as any)
    };

    let processHandler = (handler: Handler): string => {
        return ((handler: ComponentHandler|TemplateScopeHandler): string => {
            if (handler.subtype === 'componentHandler') {
                let paramsString = handler.params.map(processGetter).concat('e').join(', ');
                return `(e) => this.component.${<string>handler.name}(${paramsString})`
            } else if (handler.subtype === 'templateScopeHandler') {
                return `(e) => data.${<string>handler.name}(e)`
            } else {
                throw unsupported('event handler', handler)
            }
        })(handler as any)
    };

    return {
        content: processDomNode(node as DomNode),
        usedComponents
    }
}