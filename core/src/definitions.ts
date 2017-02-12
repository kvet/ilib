export interface Component {
    mounted?(): void;
    unmounting?(): void;
}

export interface ComponentBridge {
    getProp(name: string): any;
    setProp(name: string, value: any): void;
    getState(name: string): any;
    setState(name: string, value: any): void;
    getRef(name: string): any;
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
    state?: { [key: string]: any};
    props: { [key: string]: any };
    bindableProps: string[];
}
