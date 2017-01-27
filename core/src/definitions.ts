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

export interface ComponentMetadata {
    styles: ComponentStyle;
    
    events: string[];
    props: { [key: string]: any };
    bindableProps: string[];
}
