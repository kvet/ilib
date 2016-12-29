let fs = require('fs');
let path = require('path');
let button = require('../core/src/button');

let stringifyTemplate = (tag, content, attrs) => {
    let classes = (attrs.classes || []).map((klass) => {
        return `[class.${klass.name}]="component.${klass.getter}"`
    }).join(' ');
    let events = (attrs.events || []).map((event) => {
        return `(${event.name})="component.${event.handler}(e)"`
    }).join(' ');
    return `<${tag} ${classes} ${events}>${content}</${tag}>`
};
stringifyTemplate.contentPlaceholder = () => {
    return `<ng-content></ng-content>`
}

let stringifyStyles = () => {};
stringifyStyles.host = () => ':host';

fs.writeFileSync(path.resolve(__dirname, './src/button.ts'), `
import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
declare function require(params:any): any;
let CoreComponent = require('ilib/button').CoreComponent;

@Component({
    selector: 'il-button',
    template: \`${button.template(stringifyTemplate)}\`,
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