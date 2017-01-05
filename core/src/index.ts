export * from './definitions'

export * from './button';
export * from './toggle_button';

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
    }
]