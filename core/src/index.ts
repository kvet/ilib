export * from './definitions';

export * from './components/button';
export * from './components/toggle-button';
export * from './components/button-group';
export * from './components/toggle-button-group';

export { template as buttonComponentTemplate } from './components/button.template';
export { template as buttonGroupComponentTemplate } from './components/button-group.template';
export { template as toggleButtonComponentTemplate } from './components/toggle-button.template';
export { template as toggleButtonGroupComponentTemplate } from './components/toggle-button-group.template';

export * from './components/sizer';

export { template as sizerComponentTemplate } from './components/sizer.template'

export let definitions: {
    fileName: string;
    name: string;
    component: string;
    metadata: string;
    template: string;
    styles?: string;
}[] = [
    {
        fileName: 'button',
        name: 'Button',
        component: 'ButtonComponent',
        metadata: 'buttonComponentMetadata',
        template: 'buttonComponentTemplate',
        styles: __dirname + '/components/button.style.css'
    },
    {
        fileName: 'toggle-button',
        name: 'ToggleButton',
        component: 'ToggleButtonComponent',
        metadata: 'toggleButtonComponentMetadata',
        template: 'toggleButtonComponentTemplate',
        styles: __dirname + '/components/toggle-button.style.css'
    },
    {
        fileName: 'button-group',
        name: 'ButtonGroup',
        component: 'ButtonGroupComponent',
        metadata: 'buttonGroupComponentMetadata',
        template: 'buttonGroupComponentTemplate',
        styles: __dirname + '/components/button-group.style.css'
    },
    {
        fileName: 'toggle-button-group',
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