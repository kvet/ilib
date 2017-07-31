import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ToggleButtonComponent {
    constructor(public bridge: ComponentBridge) {}

    clickHandler(e) {
        if(!this.bridge.getProp('disabled')) {
            this.bridge.setProp('active', !this.bridge.getProp('active'));
            this.bridge.emitEvent('onClick', e);
        }
    }
};

export let toggleButtonComponentMetadata: ComponentMetadata = {
    events: [
        'onClick'
    ],
    props: {
        active: false,
        disabled: false
    },
    bindableProps: [
        'active'
    ]
}