import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class SizerComponent implements Component {
    constructor(private bridge: ComponentBridge) {}

    mounted() {
        let listenSizeChange = () => {
            let root: HTMLElement = this.bridge.getRef('root')
            this.bridge.setState('width', root.clientWidth);
            this.bridge.setState('height', root.clientHeight);
            requestAnimationFrame(listenSizeChange);
        };

        listenSizeChange()
    }
};

export let sizerComponentMetadata: ComponentMetadata = {
    events: [],
    state: {
        width: 0,
        height: 0
    },
    props: {},
    bindableProps: []
}