export interface Component {
    mounting?(): void;
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

export interface ComponentMetadata {
    events: string[];
    state?: { [key: string]: any};
    props: { [key: string]: any };
    bindableProps: string[];
}
