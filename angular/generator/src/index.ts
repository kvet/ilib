import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';

let cmpsCache = {};

let stringifyTemplate = () => {
    let usedComponents = [];

    return {
        host: (tag, content, attrs) => {
            let classes = (attrs.classes || []).map((klass) => {
                return `
                @HostBinding('class.${klass.name}') get _host_class_${klass.name}() {
                    return this.component.${klass.getter};
                }`
            }).join('\n');
            let events = (attrs.events || []).map((event) => {
                return `
                @HostListener('${event.name}') _host_on_${event.name}(e) {
                    return this.component.${event.handler}(e);
                }`
            }).join('\n');
            
            return {
                classes,
                events,
                tag,
                content,
                usedComponents
            }
        },
        contentPlaceholder: () => '<ng-content></ng-content>',
        component: (name: string, attrs: { [key: string]: any }, ...content: string[]) => {
            if(usedComponents.indexOf(name) === -1)
                usedComponents.push(name);

            return `<${cmpsCache[name].tag} ${cmpsCache[name].attr} ${
                Object.keys(attrs).map(attr => {
                    let attrData = attrs[attr];
                    if ('getter' in attrData) {
                        return `[${attr}]="component.${attrData.getter}(${attrData.params.join(', ')})"`;
                    }
                    if ('action' in attrData) {
                        return `(${attr})="component.${attrData.action}(${attrData.params.join(', ')})"`;
                    }
                }).join(' ')
            }>${content.join(', ')}</${cmpsCache[name].tag}>`;
        },
        text: (content: string) => content,
        for: (of: { getter: string }, indexName: string, valueName: string, content: string) => {
            return content.replace(
                '>',
                ` *ngFor="let ${valueName} of component.${of.getter}; let ${indexName} = index">`
            );
        },
        forIndex: (indexName: string) => indexName,
        forValue: (valueName: string) => `{{${valueName}}}`
    };
};

let stringifyStyles = {
    host: () => ':host',
    slotted: (selector) => `:host >>> ${selector}`,
    componentSelector: (name) => `[ilib-${ilib.definitions.filter((d) => d.name === name)[0].fileName}]`
};

try {
    fs.mkdirSync(path.resolve(__dirname, `../../code/src/generated`))
} catch(e) {}

for (let definition of ilib.definitions) {
    let metadata: ilib.ComponentMetadata = ilib[definition.metadata];
    let template = metadata.template(stringifyTemplate());
    let styles = metadata.styles(stringifyStyles);

    cmpsCache[definition.name] = {
        tag: template.tag,
        attr: `ilib-${definition.fileName}`
    };

    let content = `
import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostListener,
    HostBinding
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ${definition.component} } from 'ilib';
${
    template.usedComponents.map(name => {
        let definition = ilib.definitions.filter(c => c.name == name)[0];
        return `import { Il${name}Module } from './${definition.fileName}';`;
    }).join('\n')
}

@Component({
    selector: '${template.tag}[ilib-${definition.fileName}]',
    template: \`${template.content}\`,
    styles: [\`${styles}\`]
})
export class Il${definition.name}Component {
    component: ${definition.component};

${
    Object.keys(metadata.props).map((prop) => {
        return `    @Input() ${prop} = ${JSON.stringify(metadata.props[prop])};` +
               (metadata.bindableProps.indexOf(prop) > -1 ? `\n    @Output() ${prop}Change = new EventEmitter();` : '');
    }).join('\n')
}
${
    metadata.events.map((event) => {
        return `    @Output() ${event} = new EventEmitter();`;
    }).join('\n')
}
${
    template.classes
}
${
    template.events
}

    constructor() {
        this.component = new ${definition.component}({
            emitEvent: (name, e) => this[name].emit(e),
            getProp: (name) => this[name],
            setProp: (name, value) => {
                this[name] = value;
                this[name + 'Change'].emit(value);
            }
        });
    }
}

@NgModule({
    imports: [BrowserModule, ${template.usedComponents.map(name => `Il${name}Module`).join(', ')}],
    declarations: [Il${definition.name}Component],
    exports: [Il${definition.name}Component]
})
export class Il${definition.name}Module {}
`;
    fs.writeFileSync(path.resolve(__dirname, `../../code/src/generated/${definition.fileName}.ts`), content);
}

fs.writeFileSync(path.resolve(__dirname, `../../code/src/generated/index.ts`), ilib.definitions.map((d) => {
    return `export * from './${d.fileName}';`;
}).join('\n'));
