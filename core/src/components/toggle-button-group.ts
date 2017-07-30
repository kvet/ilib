import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ToggleButtonGroupComponent {
    constructor(private bridge: ComponentBridge) {}

    get items() {
        return this.bridge.getProp('items');
    }
    
    isActive(index) {
        return this.bridge.getProp('active') === index;
    }

    activate(index, e) {
        this.bridge.setProp('active', index);
        this.bridge.emitEvent('onActivate', { index: index, event: e });
    }
};

export let toggleButtonGroupComponentMetadata: ComponentMetadata = {
    events: [
        'onActivate'
    ],
    props: {
        items: [],
        active: 0
    },
    bindableProps: [
        'active'
    ]
}