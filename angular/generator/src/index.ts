import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';

let stringifyTemplate = {
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
            content
        }
    },
    contentPlaceholder: () => '<ng-content></ng-content>'
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
    let template = metadata.template(stringifyTemplate);
    let styles = metadata.styles(stringifyStyles);

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
import { ${definition.component} } from 'ilib';

@Component({
    selector: '${template.tag}[ilib-${definition.fileName}]',
    template: \`${template.content}\`,
    styles: [\`${styles}\`]
})
export class Il${definition.name}Component {
    component: ${definition.component};

${
    Object.keys(metadata.props).map((prop) => {
        return `    @Input() ${prop} = ${metadata.props[prop]};` +
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
