import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class ButtonGroupComponent {
    constructor(private bridge: ComponentBridge) {}
};

export let buttonGroupComponentMetadata: ComponentMetadata = {
    events: [],
    props: {},
    bindableProps: []
}