import {
    Node,
    DomNode,
    Handler,
    ClassToggle,
    EventListener,
    PropGetter,
    StateGetter,
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
                return `Il${tag.name}`;
            } else {
                throw unsupported('tag', tag)
            }
        };
        let processNodeAttrs = (attrs: DomNode['attrs']): string => {
            let shadowId = uniqTag(componentName);
            let classNames = node.attrs
                .filter(attr => attr.type === 'classToggle')
                .map((classToggle: ClassToggle) => {
                    return `'${classToggle.name}': ${processGetter(classToggle.state)}`
                });
            let classString = `:class="{ ${<string>classNames.join(', ')} }"`
            let attrStrings = node.attrs
                .filter(attr => attr.type !== 'classToggle')
                .map(attr => {
                    switch (attr.type) {
                        case 'attr':
                            let state = processGetter(attr.state);

                            return `:${<string>attr.name}="${state}"`;
                        case 'eventListener': 
                            let processEvent = (event: DomEvent|ComponentEvent): string => {
                                if (event.type === 'domEvent') {
                                    return event.name;
                                } else {
                                    return event.name;
                                }
                            };

                            let event = processEvent(attr.event);
                            let handler = processHandler(attr.handler);

                            return `@${event}="${handler}"`;
                        default:
                            throw unsupported('attribute', attr)
                    }
                });
            return [shadowId, classString].concat(attrStrings).join('\n');
        };
        let tag = processNodeTag(node.tag);
        let attrs = processNodeAttrs(node.attrs);
        if(node.ref) attrs = `ref="${node.ref}"\n` + attrs;
        
        return `<${tag}${attrs.length ? `\n${indent(`${attrs}`)}` : ''}>\n` +
               indent(processNodeChildrens(node.childrens)) +
               `\n</${tag}>`;
    };

    let processTextNode = (textNode: TextNode): string => {
        return `{{${processGetter(textNode.content)}}}`;
    };

    let processSlot = (slot: Slot) => '<slot></slot>';

    let processForTemplate = (forTemplate: ForTemplate) => {
        let of = processGetter(forTemplate.of);
        let value = processGetter(forTemplate.value);
        let index = forTemplate.index ? `, ${processGetter(forTemplate.index)}` : ''
        
        return `<template v-for="(${value}${index}) in ${of}">\n` +
               indent(processNodeChildrens(forTemplate.childrens)) + '\n' + 
               '</template>';
    };

    let processTemplate = (template: Template) => {
        let args = Object.keys(template.dataFields).map(name => {
            let meta = template.dataFields[name];
            let value = meta.type === 'getter' ? processGetter(meta) : processHandler(meta);
            return `:${name}="${value}"`
        }).join(' ');
        return `<slot ${args}>\n` +
               indent(processNodeChildrens(template.childrens)) + `\n` +
               `</slot>`;
    };

    let processNodeChildrens = (childrens: Node[]): string => {
        return childrens.map((children: DomNode|TextNode|Slot|ForTemplate|Template): string => {
            switch (children.subtype) {
                case 'domNode':
                    return processDomNode(children);
                case 'slot':
                    return processSlot(children);
                case 'textNode':
                    return processTextNode(children);
                case 'forTemplate':
                    return processForTemplate(children);
                case 'template':
                    return processTemplate(children);
                default:
                    throw unsupported('node type', children)
            }
        }).join('\n');
    };

    let processGetter = (getter: Getter): string => {
        return ((getter: PropGetter|StateGetter|LocalGetter|ComponentCall|StaticValue|TemplateScopeGetter): string => {
            switch (getter.subtype) {
                case 'propGetter':
                case 'stateGetter':
                    return `${<string>getter.name}`;
                case 'componentCall':
                    let params = getter.params.map((param) => processGetter(param)).join(', ');
                    return `component.${<string>getter.name}(${params})`;
                case 'localGetter':
                    return `${<string>getter.name}`;
                case 'templateScopeGetter':
                    return processGetter(getter.originalGetter);
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
                return `(e) => component.${<string>handler.name}(${paramsString})`
            } else if (handler.subtype === 'templateScopeHandler') {
                    return processHandler(handler.originalHandler);
            } else {
                throw unsupported('event handler', handler)
            }
        })(handler as any);
    };

    return {
        content: processDomNode(node as DomNode),
        usedComponents
    }
}