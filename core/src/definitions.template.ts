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


export interface ComponentHandler extends Element {
    readonly type: 'componentHandler'
    readonly name: string
    readonly params: Array<LocalGetter>
}

export interface TemplateScopeHandler extends Element {
    readonly type: 'templateScopeHandler'
    readonly name: string
    readonly originalHandler: ComponentHandler
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


let templateBuilderInternal = {
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
        return { type: 'templateScopeHandler', name, originalHandler }
    },
};

let templateBuilder = {
    // Nodes
    domNode(tag: DomNode['tag'], attrs: DomNode['attrs'], childrens: DomNode['childrens']): DomNode {
        return { type: 'node', subtype: 'domNode', tag, attrs, childrens };
    },
    textNode(content: TextNode['content']|string): TextNode {
        content = typeof content === 'string' ? templateBuilderInternal.staticValue(content) : content;
        return { type: 'node', subtype: 'textNode', content };
    },

    // Built-in templates
    forTemplate(of: ForTemplate['of'], on: (value: () => LocalGetter, index: () => LocalGetter) => Node|Node[]): ForTemplate {
        let value: LocalGetter;
        let index: LocalGetter;
        let childrens = on(
            (): LocalGetter => value ? value : (value = templateBuilderInternal.localGetter('item')),
            (): LocalGetter => index ? index : (index = templateBuilderInternal.localGetter('index')),
        );
        childrens = Array.isArray(childrens) ? childrens : [childrens]; 
        return { type: 'node', subtype: 'forTemplate', of, value, index, childrens };
    },

    // Slots
    slot(): Slot { 
        return { type: 'node', subtype: 'slot' }; 
    },
    template<T extends { [key: string]: Getter|ComponentHandler|TemplateScopeHandler }>(
        dataFields: T,
        on: (getter: (name: keyof T) => TemplateScopeGetter, handler: (name: keyof T) => TemplateScopeHandler) => Node|Node[]
    ): Template {
        let dataFieldsLocal: Template['dataFields'] = {};
        let childrens = on(
            (name: string): TemplateScopeGetter => templateBuilderInternal.templateScopeGetter(name, dataFields[name] as Getter),
            (name: string): TemplateScopeHandler => templateBuilderInternal.templateScopeHandler(name, dataFields[name] as ComponentHandler)
        );
        childrens = Array.isArray(childrens) ? childrens : [childrens]; 
        return { type: 'node', subtype: 'template', name: 'default', dataFields, childrens };
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

export interface JSXNode {
    type: 'slot'|'domNode'|'componentNode'|'forTemplate'|'template'|'textNode'
}

export interface JSXElementClass {
    type: JSXNode['type']
}

export interface JSXDomNodeProps { 
    tag: 'div'|'button',
    classNames?: { [key: string]: Getter },
    eventListeners?: { [key: string]: ComponentHandler|TemplateScopeHandler }
}

export interface JSXComponentNodeProps { 
    name: string,
    props?: { [key: string]: Getter },
    events?: { [key: string]: ComponentHandler|TemplateScopeHandler }
}

export interface JSXForTemplateNodeProps { 
    of: Getter
}

export interface JSXTemplateNodeProps { 
    dataFields: { [key: string]: Getter|ComponentHandler|TemplateScopeHandler }
}

export interface JSXTextNode { 
    content: string|Getter
}

let unsupported = (name: string, data: any) =>
    `Unsupported ${name}: ${JSON.stringify(data)}`;

export let h = {
    createElement(tagConstructor: () => JSXElementClass, _attrs, ..._childrens): Node {
        let type = tagConstructor().type;

        switch (type) {
            case 'slot': {
                if(_childrens.length) throw unsupported('childrens in slot', _childrens);

                return templateBuilder.slot();
            } case 'domNode': {
                let attrs = _attrs as JSXDomNodeProps;
                if(_childrens.filter((c: Node) => !c.type && !c.subtype).length)
                    throw unsupported('not node childrens in domNode', _childrens);
                let childrens = _childrens as Node[];

                let classAttrs = Object.keys(attrs.classNames || []).map(className => {
                    return templateBuilder.classToggle(className, attrs.classNames[className]);
                });
                let eventListeners = Object.keys(attrs.eventListeners || []).map(eventListener => {
                    return templateBuilder.eventListener(templateBuilder.domEvent(eventListener), attrs.eventListeners[eventListener]);
                });
                
                return templateBuilder.domNode(attrs.tag, [...classAttrs, ...eventListeners], childrens);
            } case 'componentNode': {
                let attrs = _attrs as JSXComponentNodeProps;
                if(_childrens.filter((c: Node) => !c.type && !c.subtype).length)
                    throw unsupported('not node childrens in componentNode', _childrens);
                let childrens = _childrens as Node[];

                let props = Object.keys(attrs.props || []).map(attr => {
                    return templateBuilder.attr(attr, attrs.props[attr])
                });
                let events = Object.keys(attrs.events || []).map(event => {
                    return templateBuilder.eventListener(event, attrs.events[event])
                });

                return templateBuilder.domNode(templateBuilder.componentTag(attrs.name), [...props, ...events], childrens);
            } case 'forTemplate': {
                let attrs = _attrs as JSXForTemplateNodeProps;
                if(_childrens.length !== 1 || typeof _childrens[0] !== 'function')
                    throw unsupported('not function children in forTemplate', _childrens);
                    
                return templateBuilder.forTemplate(attrs.of, _childrens[0]);
            } case 'template': {
                let attrs = _attrs as JSXTemplateNodeProps;
                if(_childrens.length !== 1 || typeof _childrens[0] !== 'function')
                    throw unsupported('not function children in template', _childrens);
                    
                return templateBuilder.template(attrs.dataFields, _childrens[0]);
            } case 'textNode': {
                let attrs = _attrs as JSXTextNode;
                if(_childrens.length) throw unsupported('childrens in slot', _childrens);
                    
                return templateBuilder.textNode(attrs.content);
            } default: {
                 throw unsupported('tag type', type);
            }
        }
    },

    // JSXNodes
    domNode(): { type: JSXNode['type'], props?: JSXDomNodeProps } {
        return { type: 'domNode' };
    },
    componentNode(): { type: JSXNode['type'], props?: JSXComponentNodeProps } {
        return { type: 'componentNode' };
    },
    forTemplate(): { type: JSXNode['type'], props?: JSXForTemplateNodeProps } {
        return { type: 'forTemplate' };
    },
    template(): { type: JSXNode['type'], props?: JSXTemplateNodeProps } {
        return { type: 'template' };
    },
    textNode(): { type: JSXNode['type'], props?: JSXTextNode } {
        return { type: 'textNode' };
    },
    slot(): { type: JSXNode['type'] }  {
        return { type: 'slot' }
    },

    // Access
    propGetter(name: PropGetter['name']): PropGetter { 
        return { type: 'getter', subtype: 'propGetter', name };
    },
    componentCall(name: ComponentCall['name'], ...params: ComponentCall['params']): ComponentCall { 
        return { type: 'getter', subtype: 'componentCall', name, params }; 
    },
    componentHandler(name: ComponentHandler['name'], ...params: ComponentHandler['params']): ComponentHandler { 
        return { type: 'componentHandler', name, params }; 
    },
}