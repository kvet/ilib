import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ButtonComponent {
    constructor(private bridge: ComponentBridge) {}

    get disabled() {
        return this.bridge.getProp('disabled');
    }

    clickHandler(e) {
        if(!this.disabled) {
            this.bridge.emitEvent('onClick', e);
        }
    }
};

export let buttonComponentMetadata: ComponentMetadata = {
    events: [
        'onClick'
    ],
    props: {
        disabled: false
    },
    bindableProps: []
}