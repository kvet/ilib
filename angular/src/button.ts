
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
    template: `<div [class.disabled]="component.disabled" (click)="component.clickHandler(e)"><ng-content></ng-content></div>`,
    styles: [`
    div { display: inline-block; border: 1px solid red; padding: 10px 5px; transition: all linear .2s; }
    .disabled { border: 1px solid gray; }
`]
})
export class IlButtonComponent {
    component: any;

    @Input() disabled = false;
    @Output() onClick = new EventEmitter();

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
