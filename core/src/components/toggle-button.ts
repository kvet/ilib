import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ToggleButtonComponent {
    constructor(public bridge: ComponentBridge) {}

    get disabled() {
        return this.bridge.getProp('disabled');
    }

    get active() {
        return this.bridge.getProp('active');
    }

    clickHandler(e) {
        if(!this.disabled) {
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