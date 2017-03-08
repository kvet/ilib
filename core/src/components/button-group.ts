import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ButtonGroupComponent implements Component {
    constructor(private bridge: ComponentBridge) {}
};

export let buttonGroupComponentMetadata: ComponentMetadata = {
    events: [],
    props: {},
    bindableProps: []
}