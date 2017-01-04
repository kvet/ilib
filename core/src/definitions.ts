export interface Component {}

export interface ComponentBridge {
    getProp(name: string): any;
    emitEvent(name: string, data: any): void;
}

export interface ComponentStyle {
    (builder: ComponentStyleBuilder): string;
}

export interface ComponentStyleBuilder {
    host: () => string;
}

export interface ComponentTemplate {
    <T>(builder: ComponentTemplateBuilder<T>): T;
}

export interface ComponentTemplateBuilder<T> {
    host: (tag: string, content: string, attrs: { [key: string]: any }) => T;
    contentPlaceholder: () => string;
}

export interface ComponentMetadata {
    template: ComponentTemplate;
    styles: ComponentStyle;
    
    events: string[];
    props: { [key: string]: any };
}
