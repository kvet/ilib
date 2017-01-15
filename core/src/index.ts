export * from './definitions';

export * from './components/button';
export * from './components/toggle_button';
export * from './components/button_group';

export let definitions = [
    {
        fileName: 'button',
        name: 'Button',
        component: 'ButtonComponent',
        metadata: 'buttonComponentMetadata'
    },
    {
        fileName: 'toggle_button',
        name: 'ToggleButton',
        component: 'ToggleButtonComponent',
        metadata: 'toggleButtonComponentMetadata'
    },
    {
        fileName: 'button_group',
        name: 'ButtonGroup',
        component: 'ButtonGroupComponent',
        metadata: 'buttonGroupComponentMetadata'
    }
]