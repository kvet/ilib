import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';
import { template as buildTemplate } from './template';

const HOST_TAG = "ilibhost";

let componentIds: { [key: string]: { shadowId: string } } = {};

let stringifyStyles = (componentName) => {
    return {
        host: () => `[${HOST_TAG}${<string>componentIds[componentName].shadowId}]`,
        slotted: (selector) => `[${HOST_TAG}${<string>componentIds[componentName].shadowId}] ${selector}`,
        componentSelector: (name) => `[${HOST_TAG}${<string>componentIds[name].shadowId}]`
    };
};

try {
    fs.mkdirSync(path.resolve(__dirname, `../../code/src/generated`))
} catch(e) {}
for (let definition of ilib.definitions) {
    if(definition.name === "ToggleButtonGroup") continue;

    componentIds[definition.name] = { shadowId: '' + Math.floor(Math.random() * 10000) };

    let metadata: ilib.ComponentMetadata = ilib[definition.metadata];
    let template = buildTemplate(ilib[definition.template], definition.name, componentIds);
    let styles = metadata.styles(stringifyStyles(definition.name));

    let content = (
`import { ${definition.component} } from 'ilib';
import { bindable, customElement, viewResources } from 'aurelia-templating';

@customElement('il-${definition.fileName.replace(/_/g, '-')}')
@viewResources('./${definition.fileName}.css')
export class Il${definition.name} {

${Object.keys(metadata.props).map(prop => `    @bindable() ${prop.toLowerCase()}`).join('\n')}
${metadata.events.map(event => `    @bindable() ${event.toLowerCase()}`).join('\n')}

    constructor() {
        this.component = new ${definition.component}({
            emitEvent: (name, e) => {
                name = name.toLowerCase();
                if(this[name]) {
                    this[name](e);
                }
            },
            getProp: (name) => this[name],
            setProp: () => {}
        });
    }
}`);

    try {
        fs.mkdirSync(path.resolve(__dirname, `../../demo/src/app/generated`))
    } catch(e) {}
    fs.writeFileSync(path.resolve(__dirname, `../../demo/src/app/generated/${definition.fileName}.js`), content);
    fs.writeFileSync(path.resolve(__dirname, `../../demo/src/app/generated/${definition.fileName}.css`), styles);
    fs.writeFileSync(path.resolve(__dirname, `../../demo/src/app/generated/${definition.fileName}.html`), template.content);
}