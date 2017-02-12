export * from './definitions';

export * from './components/button';
export * from './components/toggle_button';
export * from './components/button_group';
export * from './components/toggle_button_group';

export { template as buttonComponentTemplate } from './components/button.template'
export { template as buttonGroupComponentTemplate } from './components/button_group.template'
export { template as toggleButtonComponentTemplate } from './components/toggle_button.template'
export { template as toggleButtonGroupComponentTemplate } from './components/toggle_button_group.template'

export * from './components/sizer';

export { template as sizerComponentTemplate } from './components/sizer.template'

export let definitions: {
    fileName: string;
    name: string;
    component: string;
    metadata: string;
    template: string;
}[] = [
    {
        fileName: 'button',
        name: 'Button',
        component: 'ButtonComponent',
        metadata: 'buttonComponentMetadata',
        template: 'buttonComponentTemplate'
    },
    {
        fileName: 'toggle_button',
        name: 'ToggleButton',
        component: 'ToggleButtonComponent',
        metadata: 'toggleButtonComponentMetadata',
        template: 'toggleButtonComponentTemplate'
    },
    {
        fileName: 'button_group',
        name: 'ButtonGroup',
        component: 'ButtonGroupComponent',
        metadata: 'buttonGroupComponentMetadata',
        template: 'buttonGroupComponentTemplate'
    },
    {
        fileName: 'toggle_button_group',
        name: 'ToggleButtonGroup',
        component: 'ToggleButtonGroupComponent',
        metadata: 'toggleButtonGroupComponentMetadata',
        template: 'toggleButtonGroupComponentTemplate'
    },

    {
        fileName: 'sizer',
        name: 'Sizer',
        component: 'SizerComponent',
        metadata: 'sizerComponentMetadata',
        template: 'sizerComponentTemplate'
    },
]