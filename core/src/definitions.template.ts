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


export interface ClassToggle extends Element {
    readonly type: 'classToggle'
    readonly name: string
    readonly state: PropGetter
}

export interface Attr extends Element {
    readonly type: 'attr'
    readonly name: string
    readonly state: ComponentCall
}

export interface EventListener extends Element {
    readonly type: 'eventListener'
    readonly event: ComponentEvent|DomEvent
    readonly handler: ComponentHandler
}

export interface ComponentEvent extends Element {
    readonly type: 'componentEvent'
    readonly name: string
}

export interface DomEvent extends Element {
    readonly type: 'domEvent'
    readonly name: 'click'
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
    }
};

export let templateBuilder = {
    // Nodes
    domNode: (tag: DomNode['tag'], attrs: DomNode['attrs'], ...childrens: DomNode['childrens']): DomNode =>
        { return { type: 'node', subtype: 'domNode', tag, attrs, childrens }; },
    textNode: (content: TextNode['content']|string): TextNode => {
        content = typeof content === 'string' ? templateBuilderInternal.staticValue(content) : content;
        return { type: 'node', subtype: 'textNode', content };
    },

    // Built-in templates
    forTemplate: (of: ForTemplate['of'], on: (value: () => LocalGetter, index: () => LocalGetter) => Node|Node[]): ForTemplate => {
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
    slot: (): Slot =>
        { return { type: 'node', subtype: 'slot' }; },

    // Attrs
    classToggle: (name: ClassToggle['name'], state: ClassToggle['state']): ClassToggle =>
        { return { type: 'classToggle', name, state }; },
    attr: (name: Attr['name'], state: Attr['state']): Attr =>
        { return { type: 'attr', name, state }; },
    eventListener: (event: EventListener['event']|string, handler: EventListener['handler']): EventListener => {
        event = typeof event === 'string' ? { type: 'componentEvent', name: event } : event;
        return { type: 'eventListener', event, handler };
    },
    domEvent: (name: DomEvent['name']): DomEvent =>
        { return { type: 'domEvent', name: name } },

    // Access
    propGetter: (name: PropGetter['name']): PropGetter =>
        { return { type: 'getter', subtype: 'propGetter', name }; },
    componentCall: (name: ComponentCall['name'], ...params: ComponentCall['params']): ComponentCall =>
        { return { type: 'getter', subtype: 'componentCall', name, params }; },
    componentHandler: (name: ComponentHandler['name'], ...params: ComponentHandler['params']): ComponentHandler =>
        { return { type: 'componentHandler', name, params }; },

    // Composition
    componentTag: (name: ComponentTag['name']): ComponentTag =>
        { return { type: 'componentTag', name }; },
};