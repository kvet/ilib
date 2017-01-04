
import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostListener,
    HostBinding
} from '@angular/core';
import { ButtonComponent } from 'ilib';

@Component({
    selector: 'button[ilibng]',
    template: `<ng-content></ng-content>`,
    styles: [`
        :host { 
            display: inline-block;
            border: 1px solid red;
            border-radius: 5px;
            padding: 5px 10px;
            transition: all linear .2s;
            color: #373a3c;
            background-color: #fff;
            border-color: #adadad;
        }
        :host.disabled {
            cursor: not-allowed;
            opacity: .65;
        }`]
})
export class IlButtonComponent {
    component: ButtonComponent;

    @Input() disabled = false;
    @Output() onClick = new EventEmitter();

            @HostBinding('class.disabled') get _host_class_disabled() {
                return this.component.disabled;
            }

            @HostListener('click') _host_on_click(e) {
                return this.component.clickHandler(e);
            }

    constructor() {
        this.component = new ButtonComponent({
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
