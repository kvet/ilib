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
    Getter,
    StaticValue
} from '../../../core/dist/definitions.template'

let indent = (str: string): string =>
    str.split('\n').map(l => `    ${l}`).join('\n');

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export function template(node: DomNode, components: { [key: string]: { tag: string, attr?: string } }): { tag: string, rootAttrs: string, content: string, usedComponents: string[] } {
    let usedComponents = [];

    let processDomNode = (node: DomNode) => {
        let processNodeTag = (tag: DomNode['tag']): { tag: string, attr?: string } => {
            if (typeof tag === "string") {
                return { tag };
            } else if (tag.type === 'componentTag') {
                usedComponents.push(tag.name);
                return {
                    tag: components[tag.name].tag,
                    attr: `${components[tag.name].attr} [_reactiveMode]="true"`
                }
            } else {
                throw unsupported('tag', tag)
            }
        };
        let processNodeAttrs = (attrs: DomNode['attrs']): string => {
            return node.attrs.map(attr => {
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
            }).join('\n');
        };
        let tag = processNodeTag(node.tag);
        let attrs = processNodeAttrs(node.attrs);
        
        return `<${tag.tag}${tag.attr ? ` ${tag.attr}`: ''}${attrs.length ? `\n${indent(`${attrs}`)}` : ''}>\n` +
               indent(processNodeChildrens(node.childrens)) +
               `\n</${tag.tag}>`;
    };

    let processTextNode = (textNode: TextNode): string => {
        return `{{${processGetter(textNode.content)}}}`;
    };

    let processSlot = (slot: Slot) => '<ng-content></ng-content>';

    let processForLoop = (forTemplate: ForTemplate) => {
        let of = processGetter(forTemplate.of);
        let value = processGetter(forTemplate.value);
        let index = forTemplate.index ? ` let-${processGetter(forTemplate.index)}="index"` : '';

        return `<template ngFor let-${value} [ngForOf]="${of}"${index}>\n` +
               indent(processNodeChildrens(forTemplate.childrens)) + '\n' + 
               '</template>';
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
                    return processForLoop(children);
                default:
                    throw unsupported('node type', children)
            }
        }).join('\n');
    };

    let processGetter = (getter: Getter, withinClass = false): string => {
        return ((getter: PropGetter|LocalGetter|ComponentCall|StaticValue): string => {
            switch (getter.subtype) {
                case 'propGetter':
                    return `${withinClass ? 'this.' : ''}${<string>getter.name}`;
                case 'componentCall':
                    let params = getter.params.map((param) => processGetter(param, withinClass)).join(', ');
                    return `${withinClass ? 'this.' : ''}component.${<string>getter.name}(${params})`;
                case 'localGetter':
                    return `${<string>getter.name}`;
                case 'staticValue':
                    return JSON.stringify(getter.value);
                default:
                    throw unsupported('getter', getter)
            }
        })(getter as any)
    };

    let processHandler = (handler: EventListener['handler'], withinClass = false): string => {
        if (handler.type === 'componentHandler') {
            let paramsString = handler.params.map((param) => processGetter(param)).concat('$event').join(', ');
            return `${withinClass ? 'this.' : ''}component.${<string>handler.name}(${paramsString})`
        } else {
            throw unsupported('revent handler', handler)
        }
    };

    let processRootAttrs = (attrs: DomNode['attrs']): string => {
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