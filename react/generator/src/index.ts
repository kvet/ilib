import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';
import { template as buildTemplate } from './template';

const HOST_TAG = "data-ilibhost";

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
    componentIds[definition.name] = { shadowId: '' + Math.floor(Math.random() * 10000) };

    let metadata: ilib.ComponentMetadata = ilib[definition.metadata];
    let template = buildTemplate(ilib[definition.template], definition.name, componentIds);
    let styles = metadata.styles(stringifyStyles(definition.name));

    let content = `
import { Component, createElement } from 'react';
import { ${definition.component} } from 'ilib';
import './${definition.fileName}.css';
${
    template.usedComponents.map(name => {
        let definition = ilib.definitions.filter(c => c.name == name)[0];
        return `import { ${name} } from './${definition.fileName}';`;
    }).join('\n')
}

export class ${definition.name} extends Component {
    constructor(props) {
        super(props);

        this.component = new ${definition.component}({
            emitEvent: (name, e) => {
                this.props[name] && this.props[name](e);
            },
            getProp: (name) => this.props[name],
            setProp: () => {},
            getState: (name) => this.state[name],
            setState: (name, value) => { this.setState({ [name]: value })},
            getRef: (name) => this._refs[name]
        });

        this._refs = {}

        ${metadata.state ? `this.state = ${JSON.stringify(metadata.state)}` : ''} 
    }
    componentDidMount() {
        this.component.mounted && this.component.mounted();
    }
    componentWillUnmount() {
        this.component.unmounting && this.component.unmounting();
    }
    render() {
        return (
${template.content}
        );
    }
}`;
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