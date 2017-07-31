import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ButtonComponent {
    constructor(private bridge: ComponentBridge) {}

    clickHandler(e) {
        if(!this.bridge.getProp('disabled')) {
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