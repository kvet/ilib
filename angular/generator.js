let fs = require('fs');
let path = require('path');
let button = require('../core/src/button');

let stringifyTemplateData = {};

let stringifyTemplate = () => {};
stringifyTemplate.host = (tag, content, attrs) => {
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
    stringifyTemplateData.host = {
        classes,
        events,
        tag
    }
    return `${content}`
};
stringifyTemplate.contentPlaceholder = () => {
    return `<ng-content></ng-content>`
}

let stringifyStyles = () => {};
stringifyStyles.host = () => ':host';

let template = button.template(stringifyTemplate);

fs.writeFileSync(path.resolve(__dirname, './src/button.ts'), `
import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostListener,
    HostBinding
} from '@angular/core';
declare function require(params:any): any;
let CoreComponent = require('ilib/button').CoreComponent;

@Component({
    selector: '${stringifyTemplateData.host.tag}[ilibng]',
    template: \`${template}\`,
    styles: [\`${button.styles(stringifyStyles)}\`]
})
export class IlButtonComponent {
    component: any;

${
    Object.keys(button.props).map((prop) => {
        return `    @Input() ${prop} = ${button.props[prop]};`;
    }).join('\n')
}
${
    button.events.map((event) => {
        return `    @Output() ${event} = new EventEmitter();`;
    }).join('\n')
}
${
    stringifyTemplateData.host.classes
}
${
    stringifyTemplateData.host.events
}

    constructor() {
        this.component = new CoreComponent({
            emitEvent: (name, e) => {
                this[name].emit(e);
            },
            getProp: (name) => {
                return this[name];
            }
        });
    }
}

@NgModule({
    declarations: [IlButtonComponent],
    exports: [IlButtonComponent]
})
export class IlButtonModule {}
`)