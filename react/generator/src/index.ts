import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';
import { template as buildTemplate } from './template';

const HOST_TAG = "data-ilibhost";

let cap = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let componentIds: { [key: string]: { shadowId: string } } = {};
let stringifyTemplate = (componentName) => {
    let usedComponents = [];

    return {
        host: (tag, content, attrs) => {
            let classes = (attrs.classes || []).map((klass) => {
                return `(this.component.${klass.getter} ? '${klass.name} ' : '')`;
            }).join(' + ');
            classes = classes ? ' + \' \' + ' + classes : '';
            let events = (attrs.events || []).map((event) => {
                return {
                    event: `on${cap(event.name)}`,
                    handler: `this.component.${event.handler}.bind(this.component)`
                };
            });

            return {
                template: `createElement(
                '${tag}',
                {
                    '${HOST_TAG}${componentIds[componentName]}': true,
                    className: (this.props.className || '') ${classes},
    ${
                events.map((event) => {
                    return `            ${event.event}:${event.handler},`;
                }).join('\n')
    }
                },
                ${content}
            )`,
                usedComponents
            }
        },
        contentPlaceholder: () => 'this.props.children',
        component: (name: string, attrs, ...content) => {
            if(usedComponents.indexOf(name) === -1)
                usedComponents.push(name);
            return `createElement(${name}, { ${
                Object.keys(attrs).map(attr => {
                    let attrData = attrs[attr];
                    if ('getter' in attrData) {
                        return `${attr}: this.component.${attrData.getter}(${attrData.params.join(', ')})`;
                    }
                    if ('action' in attrData) {
                        return `${attr}: this.component.${attrData.action}.bind(${['this.component'].concat(attrData.params).join(', ')})`;
                    }
                }).join(', ')
            } }, ${content.join(', ')})`;
        },
        text: (content) => `'${content}'`,
        for: (of: { getter: string }, indexName: string, valueName: string, content: string) => {
            return `...(this.component.${of.getter}.map((${valueName}, ${indexName}) => ${content}))`
        },
        forIndex: (indexName) => indexName,
        forValue: (valueName) => valueName,
    };
};

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
            setProp: () => {}
        });
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