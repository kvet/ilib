import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';
import { template as buildTemplate } from './template';

let cmpsCache = {};

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
    let template = buildTemplate(ilib[definition.template], cmpsCache);
    let styles = metadata.styles(stringifyStyles);

    cmpsCache[definition.name] = {
        tag: template.tag,
        attr: `ilib-${definition.fileName}`
    };

    let constructorArgs = ['private ngZone: NgZone', 'private changeDetectorRef: ChangeDetectorRef'];
    if(template.rootRef) constructorArgs.push(`private ${template.rootRef + 'Ref'}: ElementRef`);
    if(template.templateUsed) constructorArgs.push(`templateHost: IlTemplateHost`);

    let content = `
import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostListener,
    HostBinding,
    OnInit,
    ChangeDetectionStrategy,
    ElementRef,
    OnDestroy,
    NgZone,
    ChangeDetectorRef
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ${definition.component} } from 'ilib';
${
    template.usedComponents.map(name => {
        let definition = ilib.definitions.filter(c => c.name == name)[0];
        return `import { Il${name}Module } from './${definition.fileName}';`;
    }).join('\n')
}
${
    template.templateUsed ? `import { IlTemplateHost, IlTemplateModule, IlTemplateDirective } from '../template';` : ''
}

@Component({
    selector: '${template.tag}[ilib-${definition.fileName}]',
    template: \`${template.content}\`,
    styles: [\`${styles}\`],
    providers: [${template.templateUsed ? 'IlTemplateHost' : ''}],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Il${definition.name}Component implements OnInit, OnDestroy {
    private component: ${definition.component};

    @Input() _reactiveMode = false;
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
    Object.keys(metadata.state || {}).map((prop) => {
        return `    @Input() ${prop} = ${JSON.stringify(metadata.state[prop])};`
    }).join('\n')
}
${template.rootAttrs}

    constructor(${constructorArgs.join(', ')}) {}

    ngOnInit() {
        // NOTE: component should be intantiated in constructor, but it can be done only after removing of '_reactiveMode'
        this.component = new ${definition.component}({
            emitEvent: (name, e) => this[name].emit(e),
            getProp: (name) => this[name],
            setProp: this._reactiveMode ? () => {} : (name, value) => {
                this.ngZone.run(() => {
                    if(this[name] !== value) {
                        this[name] = value;
                        this[name + 'Change'].emit(value);
                    }
                })
            },
            getState: (name) => this[name],
            setState: (name, value) => { 
                this.ngZone.run(() => {
                    if(this[name] !== value) {
                        this[name] = value;
                        this.changeDetectorRef.markForCheck();
                    }
                })
            },
            getRef: (name) => this[name + 'Ref'].nativeElement,
        });

        ${ilib[definition.component].prototype.mounted ? 'this.component.mounted();' : ''}
    }

    ngOnDestroy() {
        ${ilib[definition.component].prototype.unmounting ? 'this.component.unmounting();' : ''}
    }
}

@NgModule({
    imports: [BrowserModule${template.templateUsed ? ', IlTemplateModule' : ''}, ${template.usedComponents.map(name => `Il${name}Module`).join(', ')}],
    declarations: [Il${definition.name}Component],
    exports: [Il${definition.name}Component${template.templateUsed ? ', IlTemplateDirective' : ''}]
})
export class Il${definition.name}Module {}
`;
    fs.writeFileSync(path.resolve(__dirname, `../../code/src/generated/${definition.fileName}.ts`), content);
}

fs.writeFileSync(path.resolve(__dirname, `../../code/src/generated/index.ts`), ilib.definitions.map((d) => {
    return `export * from './${d.fileName}';`;
}).join('\n'));
