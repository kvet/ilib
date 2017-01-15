import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

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
        ${e.slotted(`${e.componentSelector('Button')}`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}`)} { 
            float: left;
            position: relative;
        }
        ${e.slotted(`${e.componentSelector('Button')}:first-child`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}:first-child`)} {
            border-radius: 3px 0 0 3px;
        }
        ${e.slotted(`${e.componentSelector('Button')}:last-child`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}:last-child`)} {
            border-radius: 0 3px 3px 0;
        }
        ${e.slotted(`${e.componentSelector('Button')}:not(:first-child)`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}:not(:first-child)`)} {
            margin-left: -1px;
        }`;
    },
    events: [],
    props: {},
    bindableProps: []
}