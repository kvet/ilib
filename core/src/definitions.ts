export interface Component {}

export interface ComponentBridge {
    getProp(name: string): any;
    setProp(name: string, value: any): void;
    emitEvent(name: string, data: any): void;
}

export interface ComponentStyle {
    (builder: ComponentStyleBuilder): string;
}

export interface ComponentStyleBuilder {
    host: () => string; 
    slotted: (selector: string) => string;

    componentSelector: (name: string) => string;
}

export interface ComponentTemplate {
    <T>(builder: ComponentTemplateBuilder<T>): T;
}

export interface ComponentTemplateBuilder<T> {
    host: (tag: string, content: string, attrs: { [key: string]: any }) => T;
    contentPlaceholder: () => string;
    component: (name: string, attrs: { [key: string]: any }, ...content: string[]) => string;
    text: (content: string) => string;
    for: (of: { getter: string }, indexName: string, valueName: string, content: string) => string;
    forIndex: (indexName: string) => string;
    forValue: (valueName: string) => string;
}

export interface ComponentMetadata {
    template: ComponentTemplate;
    styles: ComponentStyle;
    
    events: string[];
    props: { [key: string]: any };
    bindableProps: string[];
}
