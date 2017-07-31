import { ComponentMetadata } from './definitions';

// Schema

export interface Element {
    readonly type: string;
}


export interface Node extends Element {
    readonly type: 'node'
    readonly subtype: string
}

export interface DomNode extends Node {
    readonly subtype: 'domNode'
    readonly tag: string|ComponentTag
    readonly attrs: (ClassToggle|Attr|EventListener)[]
    readonly childrens: Node[]
    readonly ref?: string
}

export interface TextNode extends Node {
    readonly subtype: 'textNode'
    readonly content: Getter
}

export interface Slot extends Node {
    readonly subtype: 'slot'
}

export interface Template extends Node {
    readonly subtype: 'template'
    readonly name: 'default'
    readonly dataFields: { [key: string]: Getter|ComponentHandler|TemplateScopeHandler }
    readonly childrens: Node[]
}

export interface ForTemplate extends Node {
    readonly subtype: 'forTemplate'
    readonly childrens: Node[]
    readonly of: Getter
    readonly value: LocalGetter
    readonly index?: LocalGetter
}


export interface Getter extends Element {
    readonly type: 'getter'
    readonly subtype: string
}

export interface StaticValue extends Getter {
    readonly subtype: 'staticValue'
    readonly value: any
}

export interface PropGetter extends Getter {
    readonly subtype: 'propGetter'
    readonly name: string
}

export interface StateGetter extends Getter {
    readonly subtype: 'stateGetter'
    readonly name: string
}

export interface LocalGetter extends Getter {
    readonly subtype: 'localGetter'
    readonly name: string
}

export interface TemplateScopeGetter extends Getter {
    readonly subtype: 'templateScopeGetter'
    readonly name: string
    readonly originalGetter: Getter
}

export interface ComponentCall extends Getter {
    readonly subtype: 'componentCall'
    readonly name: string
    readonly params: Array<LocalGetter>
}


export interface Handler extends Element {
    readonly type: 'handler'
    readonly subtype: string
}

export interface ComponentHandler extends Handler {
    readonly subtype: 'componentHandler'
    readonly name: string
    readonly params: Array<LocalGetter>
}

export interface TemplateScopeHandler extends Handler {
    readonly subtype: 'templateScopeHandler'
    readonly name: string
    readonly originalHandler: Handler
}


export interface ClassToggle extends Element {
    readonly type: 'classToggle'
    readonly name: string
    readonly state: Getter
}

export interface Attr extends Element {
    readonly type: 'attr'
    readonly name: string
    readonly state: Getter
}

export interface EventListener extends Element {
    readonly type: 'eventListener'
    readonly event: ComponentEvent|DomEvent
    readonly handler: ComponentHandler|TemplateScopeHandler
}

export interface ComponentEvent extends Element {
    readonly type: 'componentEvent'
    readonly name: string
}

export interface DomEvent extends Element {
    readonly type: 'domEvent'
    readonly name: string
}

export interface ComponentTag extends Element {
    readonly type: 'componentTag'
    readonly name: string
}


// JSX

let helpers = {
    // Access
    propGetter(name: PropGetter['name']): PropGetter { 
        return { type: 'getter', subtype: 'propGetter', name };
    },
    stateGetter(name: StateGetter['name']): StateGetter { 
        return { type: 'getter', subtype: 'stateGetter', name };
    },
    staticValue(value: StaticValue['value']): StaticValue {
        return { type: 'getter', subtype: 'staticValue', value }
    },
    localGetter(name: LocalGetter['name']): LocalGetter {
        return { type: 'getter', subtype: 'localGetter', name }
    },
    templateScopeGetter(name: TemplateScopeGetter['name'], originalGetter: TemplateScopeGetter['originalGetter']): TemplateScopeGetter {
        return { type: 'getter', subtype: 'templateScopeGetter', name, originalGetter }
    },
    templateScopeHandler(name: TemplateScopeHandler['name'], originalHandler: TemplateScopeHandler['originalHandler']): TemplateScopeHandler {
        return { type: 'handler', subtype: 'templateScopeHandler', name, originalHandler }
    },

    // Attrs
    classToggle(name: ClassToggle['name'], state: ClassToggle['state']): ClassToggle { 
        return { type: 'classToggle', name, state };
    },
    attr(name: Attr['name'], state: Attr['state']): Attr { 
        return { type: 'attr', name, state }; 
    },
    eventListener(event: EventListener['event']|string, handler: EventListener['handler']): EventListener {
        event = typeof event === 'string' ? { type: 'componentEvent', name: event } : event;
        return { type: 'eventListener', event, handler };
    },
    domEvent(name: DomEvent['name']): DomEvent { 
        return { type: 'domEvent', name: name }
    },

    // Composition
    componentTag(name: ComponentTag['name']): ComponentTag { 
        return { type: 'componentTag', name }; 
    },
};

export interface JSXNode<T> {
    props?: T
    render: (attrs: T, children) => Node
}

export interface JSXDomNodeProps { 
    tag: 'div'|'button';
    classNames?: { [key: string]: Getter };
    eventListeners?: { [key: string]: ComponentHandler|TemplateScopeHandler };
    ref?: string;
}

export interface JSXComponentNodeProps { 
    name: string;
    props?: { [key: string]: Getter };
    events?: { [key: string]: ComponentHandler|TemplateScopeHandler };
}

export interface JSXForTemplateNodeProps { 
    of: Getter
}

export interface JSXTemplateNodeProps { 
    [key: string]: Getter|ComponentHandler|TemplateScopeHandler
}

export interface JSXTextNode { 
    content: string|Getter
}

export interface JSXSlotProps {}

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export let h = {
    createElement<T>(tagConstructor: () => JSXNode<T>, _attrs, ..._childrens): Node {
        return tagConstructor().render(_attrs, _childrens);
    },

    // JSXNodes
    domNode(): JSXNode<JSXDomNodeProps> {
        return {
            render: (attrs, childrens) => {
                if(childrens.filter((c: Node) => !c.type && !c.subtype).length)
                    throw unsupported('not node childrens in domNode', childrens);

                let classAttrs = Object.keys(attrs.classNames || []).map(className => {
                    return helpers.classToggle(className, attrs.classNames[className]);
                });
                let eventListeners = Object.keys(attrs.eventListeners || []).map(eventListener => {
                    return helpers.eventListener(helpers.domEvent(eventListener), attrs.eventListeners[eventListener]);
                });

                return { type: 'node', subtype: 'domNode', tag: attrs.tag, attrs: [...classAttrs, ...eventListeners], childrens, ref: attrs.ref } as DomNode;
            }
        };
    },
    componentNode(): JSXNode<JSXComponentNodeProps> {
        return {
            render: (attrs, childrens) => {
                if(childrens.filter((c: Node) => !c.type && !c.subtype).length)
                    throw unsupported('not node childrens in componentNode', childrens);

                let props = Object.keys(attrs.props || []).map(attr => {
                    return helpers.attr(attr, attrs.props[attr])
                });
                let events = Object.keys(attrs.events || []).map(event => {
                    return helpers.eventListener(event, attrs.events[event])
                });

                return { type: 'node', subtype: 'domNode', tag: helpers.componentTag(attrs.name), attrs: [...props, ...events], childrens } as DomNode;
            }
        };
    },
    forTemplate(): JSXNode<JSXForTemplateNodeProps> {
        return {
            render: (attrs, childrens) => {
                if(childrens.length !== 1 || typeof childrens[0] !== 'function')
                    throw unsupported('not function children in forTemplate', childrens);

                let item: LocalGetter;
                let index: LocalGetter;
                let dataFieldsLocal = {};
                Object.defineProperty(dataFieldsLocal, 'item', { get: (): LocalGetter => item ? item : (item = helpers.localGetter('item')) })
                Object.defineProperty(dataFieldsLocal, 'index', { get: (): LocalGetter => index ? index : (index = helpers.localGetter('index')) })
                let localChildrens = childrens[0](dataFieldsLocal);
                localChildrens = Array.isArray(localChildrens) ? localChildrens : [localChildrens]; 
                return { type: 'node', subtype: 'forTemplate', of: attrs.of, value: item, index, childrens: localChildrens } as ForTemplate;
            }
        };
    },
    template(): JSXNode<JSXTemplateNodeProps> {
        return {
            render: (attrs, childrens) => {
                if(childrens.length !== 1 || typeof childrens[0] !== 'function')
                    throw unsupported('not function children in template', childrens);
                
                let dataFields = attrs;
                let dataFieldsLocal = Object.keys(dataFields).reduce((result, name) => {
                    result[name] = dataFields[name].type === 'getter'
                        ? helpers.templateScopeGetter(name, dataFields[name] as Getter)
                        : helpers.templateScopeHandler(name, dataFields[name] as ComponentHandler)
                    return result;
                }, {});
                let localChildrens = childrens[0](dataFieldsLocal);
                localChildrens = Array.isArray(localChildrens) ? localChildrens : [localChildrens]; 
                return { type: 'node', subtype: 'template', name: 'default', dataFields, childrens: localChildrens } as Template;
            }
        };
    },
    textNode(): JSXNode<JSXTextNode> {
        return {
            render: (attrs, childrens) => {
                if(childrens.length) throw unsupported('childrens in slot', childrens);
                    
                let content = typeof attrs.content === 'object' ? attrs.content : helpers.staticValue(attrs.content);
                return { type: 'node', subtype: 'textNode', content } as TextNode;
            }
        };
    },
    slot(): JSXNode<JSXSlotProps> {
        return {
            render: (attrs, childrens) => {
                if(childrens.length) throw unsupported('childrens in slot', childrens);

                return { type: 'node', subtype: 'slot' };
            }
        }
    },

    // Temp
    component(metadata: ComponentMetadata, rootTemplate: (
        props: { [key: string]: PropGetter },
        state: { [key: string]: PropGetter }
    ) => Node): Node {
        const propsGetters = Object.keys(metadata.props)
            .map(name => ({ name, getter: helpers.propGetter(name) }))
            .reduce((acc, { name, getter }) => ({ ...acc, [name]: getter }), {});
        const stateGetters = Object.keys(metadata.state || {})
            .map(name => ({ name, getter: helpers.stateGetter(name) }))
            .reduce((acc, { name, getter }) => ({ ...acc, [name]: getter }), {});
        return rootTemplate(propsGetters, stateGetters);
    },

    // Access
    componentCall(name: ComponentCall['name'], ...params: ComponentCall['params']): ComponentCall { 
        return { type: 'getter', subtype: 'componentCall', name, params }; 
    },
    componentHandler(name: ComponentHandler['name'], ...params: ComponentHandler['params']): ComponentHandler { 
        return { type: 'handler', subtype: 'componentHandler', name, params }; 
    },
}