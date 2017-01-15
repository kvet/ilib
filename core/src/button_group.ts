import { Component, ComponentBridge, ComponentMetadata } from './definitions';

export class ButtonGroupComponent implements Component {
    constructor(private bridge: ComponentBridge) {}
};

export let buttonGroupComponentMetadata: ComponentMetadata = {
    template: (e) => { 
        return e.host(
            'div',
            e.contentPlaceholder(),
            { 
                classes: [],
                events: []
            }
        );
    },

    styles: (e) => {
        return `
        ${e.slotted('button')} { 
            float: left;
            position: relative;
        }
        ${e.slotted('button:first-child')} {
            border-radius: 3px 0 0 3px;
        }
        ${e.slotted('button:last-child')} {
            border-radius: 0 3px 3px 0;
        }
        ${e.slotted('button:not(:first-child)')} {
            margin-left: -1px;
        }`;
    },
    events: [],
    props: {},
    bindableProps: []
}