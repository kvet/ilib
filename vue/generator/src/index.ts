import * as fs from 'fs';
import * as path from 'path';
import * as ilib from '../../../core/dist';
import { template as buildTemplate } from './template';
import { unique } from 'shorthash';

const HOST_TAG = "ilibhost-";

let stringifyStyles = (componentName) => {
    return {
        host: () => `[${HOST_TAG}${unique(componentName)}]`,
        slotted: (selector) => `[${HOST_TAG}${unique(componentName)}] ${selector}`,
        componentSelector: (name) => `[${HOST_TAG}${unique(name)}]`
    };
};

try {
    fs.mkdirSync(path.resolve(__dirname, `../../code/src/generated`))
} catch(e) {}
for (let definition of ilib.definitions) {
    let metadata: ilib.ComponentMetadata = ilib[definition.metadata];
    let template = buildTemplate(ilib[definition.template], definition.name);
    let styles = metadata.styles(stringifyStyles(definition.name));

    let content = (
`import { ${definition.component} } from 'ilib';
import './${definition.fileName}.css';
${
    template.usedComponents.map(name => {
        let definition = ilib.definitions.filter(c => c.name == name)[0];
        return `import { Il${name} } from './${definition.fileName}';`;
    }).join('\n')
}

export const Il${definition.name} = {
    created() {
        this.component = new ${definition.component}({
            emitEvent: (name, e) => {
                this.$emit(name, e);
            },
            getProp: (name) => this[name],
            setProp: () => {},
            getState: (name) => this[name],
            setState: (name, value) => { this[name] = value },
            getRef: (name) => this.$refs[name]
        });
    },
    mounted() {
        this.component.mounted && this.component.mounted();
    },
    beforeDestroy() {
        this.component.unmounting && this.component.unmounting();
    },
    data() {
        return {
            component: this.component,
            ${Object.keys(metadata.state || {}).map(prop => `${prop}: ${JSON.stringify(metadata.state[prop])}`).join(',\n')}
        }
    },
    props: [${Object.keys(metadata.props).map(prop => `'${prop}'`).join(', ')}],
    components: { ${template.usedComponents.map(cmp => `Il${cmp}`).join(', ')} },
    template: (
\`${<string>template.content}\`
    )
}`);

    fs.writeFileSync(path.resolve(__dirname, `../../code/src/generated/${definition.fileName}.js`), content);
    try {
        fs.mkdirSync(path.resolve(__dirname, `../../code/dist`))
    } catch(e) {}
    try {
        fs.mkdirSync(path.resolve(__dirname, `../../code/dist/generated`))
    } catch(e) {}
    fs.writeFileSync(path.resolve(__dirname, `../../code/dist/generated/${definition.fileName}.css`), styles);
}

fs.writeFileSync(path.resolve(__dirname, `../../code/src/generated/index.js`), ilib.definitions.map((d) => {
    return `export * from './${d.fileName}';`;
}).join('\n'));