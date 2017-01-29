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
    ComponentCall,
    DomEvent,
    ComponentEvent
} from '../../../core/dist/template_definitions'

const HOST_TAG = "ilibhost";

let indent = (str: string): string =>
    str.split('\n').map(l => `    ${l}`).join('\n');

let cap = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export function template(node: Node, componentName: string, components: { [key: string]: { shadowId: string } }): { content: string, usedComponents: string[] } {
    let usedComponents = [];

    let processNode = (node: Node) => {
        let processNodeTag = (tag: Node['tag']): string => {
            if (typeof tag === "string") {
                return tag;
            } else if (tag.type === 'componentTag') {
                usedComponents.push(tag.name);
                return `Il${tag.name}`;
            } else {
                throw unsupported('tag', tag)
            }
        };
        let processNodeAttrs = (attrs: Node['attrs']): string => {
            let shadowId = `${HOST_TAG}${<string>components[componentName].shadowId}`
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
                return `{{${processGetter(content)}}}`;
            default:
                throw unsupported('text node content', content)
        }
    };

    let processContentPlaceholder = (contentPlaceholder: ContentPlaceholder) => '<slot></slot>';

    let processForLoop = (forLoop: ForLoop) => {
        let of = processGetter(forLoop.of);
        let value = processGetter(forLoop.value);
        let index = forLoop.index ? `, ${processGetter(forLoop.index)}` : ''
        
        return `<template v-for="(${value}${index}) in ${of}">\n` +
               indent(processNode(forLoop.children)) + '\n' + 
               '</template>';
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

    let processGetter = (getter: PropGetter|LocalGetter|ComponentCall): string => {
        switch (getter.type) {
            case 'propGetter':
                return `${<string>getter.name}`;
            case 'componentCall':
                let params = getter.params.map((param) => processGetter(param)).join(', ');
                return `component.${<string>getter.name}(${params})`;
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
            return `(e) => component.${<string>handler.name}(${paramsString})`
        } else {
            throw unsupported('event handler', handler)
        }
    };

    return {
        content: processNode(node),
        usedComponents
    }
}