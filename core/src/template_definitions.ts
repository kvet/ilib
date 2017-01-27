export interface Element {
    readonly type: string;
}


export interface Node extends Element {
    readonly type: 'node'
    readonly tag: string|ComponentTag
    readonly attrs: (ClassToggle|Attr|EventListener)[]
    readonly childrens: (Node|TextNode|ContentPlaceholder|ForLoop)[]
}

export interface TextNode extends Element {
    readonly type: 'textNode'
    readonly content: StaticValue|LocalGetter
}

export interface ContentPlaceholder extends Element {
    readonly type: 'contentPlaceholder'
}

export interface ForLoop extends Element {
    readonly type: 'forLoop'
    readonly children: Node
    readonly of: PropGetter
    readonly value: LocalGetter
    readonly index?: LocalGetter
}


export interface StaticValue extends Element {
    readonly type: 'staticValue'
    readonly value: any
}

export interface PropGetter extends Element {
    readonly type: 'propGetter'
    readonly name: string
}

export interface LocalGetter extends Element {
    readonly type: 'localGetter'
    readonly name: string
}

export interface ComponentCall extends Element {
    readonly type: 'componentCall'
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


export let templateBuilder = {
    // Basic
    node: (tag: Node['tag'], attrs: Node['attrs'], ...childrens: Node['childrens']): Node =>
        { return { type: 'node', tag, attrs, childrens }; },
    text: (content: TextNode['content']|string): TextNode => {
        content = typeof content === 'string' ? { type: 'staticValue', value: content } : content;
        return { type: 'textNode', content };
    },

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
        { return { type: 'propGetter', name }; },
    componentCall: (name: ComponentCall['name'], ...params: ComponentCall['params']): ComponentCall =>
        { return { type: 'componentCall', name, params }; },
    componentHandler: (name: ComponentHandler['name'], ...params: ComponentHandler['params']): ComponentHandler =>
        { return { type: 'componentHandler', name, params }; },

    // Logic
    forLoop: (of: ForLoop['of'], on: (value: () => LocalGetter, index: () => LocalGetter) => Node): ForLoop => {
        let value: LocalGetter;
        let index: LocalGetter;
        let children = on(
            (): LocalGetter => value ? value : (value = { type: 'localGetter', name: 'value' }),
            (): LocalGetter => index ? index : (index = { type: 'localGetter', name: 'index' }),
        )
        return { type: 'forLoop', of, value, index, children };
    },

    // Composition
    componentTag: (name: ComponentTag['name']): ComponentTag =>
        { return { type: 'componentTag', name }; },

    // Templates
    contentPlaceholder: (): ContentPlaceholder =>
        { return { type: 'contentPlaceholder' }; },
}