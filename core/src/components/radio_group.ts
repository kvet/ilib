import { Component, ComponentBridge, ComponentMetadata } from '../definitions';

export class RadioGroupComponent implements Component {
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

export let radioGroupComponentMetadata: ComponentMetadata = {
    template: (e) => { 
        return e.host(
            'div',
            e.component(
                'ButtonGroup',
                {},
                e.for(
                    { getter: 'items' },
                    'index',
                    'item',
                    e.component(
                        'ToggleButton',
                        { 
                            active: { getter: 'isActive', params: [e.forIndex('index')] },
                            onClick: { action: 'activate', params: [e.forIndex('index')] }
                        },
                        e.forValue('item')
                    )
                )
            ),
            { 
                classes: [],
                events: []
            }
        );
    },

    styles: (e) => {
        return ``;
    },
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