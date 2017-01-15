import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ToggleButtonComponent implements Component {
    constructor(private bridge: ComponentBridge) {}

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
    template: (e) => { 
        return e.host(
            'button',
            e.contentPlaceholder(),
            { 
                classes: [
                    { name: 'disabled', getter: 'disabled' },
                    { name: 'active', getter: 'active' }
                ],
                events: [{ name: 'click', handler: 'clickHandler' }]
            }
        );
    },

    styles: (e) => {
        return `
        ${e.host()} {
            margin: 0;
            display: inline-block;
            border: 1px solid red;
            border-radius: 5px;
            padding: 5px 10px;
            transition: all linear .2s;
            color: #373a3c;
            background-color: #fff;
            border-color: #adadad;
        }
        ${e.host()}.active {
            background-color: #ddd;
        }
        ${e.host()}.disabled {
            cursor: not-allowed;
            opacity: .65;
        }`;
    },
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