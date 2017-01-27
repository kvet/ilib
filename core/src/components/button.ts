import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ButtonComponent implements Component {
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
        ${e.host()}.disabled {
            cursor: not-allowed;
            opacity: .65;
        }`;
    },
    events: [
        'onClick'
    ],
    props: {
        disabled: false
    },
    bindableProps: []
}