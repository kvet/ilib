import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ButtonGroupComponent implements Component {
    constructor(private bridge: ComponentBridge) {}
};

export let buttonGroupComponentMetadata: ComponentMetadata = {
    styles: (e) => {
        return `
        ${e.host()} {
            display: inline-block;
        }

        ${e.slotted(`${e.componentSelector('Button')}`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}`)} { 
            float: left;
            position: relative;
            border-radius: 0;
        }
        ${e.slotted(`${e.componentSelector('Button')}:first-child`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}:first-child`)} {
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
        }
        ${e.slotted(`${e.componentSelector('Button')}:last-child`)},
        ${e.slotted(`${e.componentSelector('ToggleButton')}:last-child`)} {
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
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