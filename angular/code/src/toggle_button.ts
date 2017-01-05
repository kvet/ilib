
import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostListener,
    HostBinding
} from '@angular/core';
import { ToggleButtonComponent } from 'ilib';

@Component({
    selector: 'button[ilib-toggle_button]',
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
        :host.active {
            background-color: #ddd;
        }
        :host.disabled {
            cursor: not-allowed;
            opacity: .65;
        }`]
})
export class IlToggleButtonComponent {
    component: ToggleButtonComponent;

    @Input() active = false;
    @Output() activeChange = new EventEmitter();
    @Input() disabled = false;
    @Output() onClick = new EventEmitter();

            @HostBinding('class.disabled') get _host_class_disabled() {
                return this.component.disabled;
            }

            @HostBinding('class.active') get _host_class_active() {
                return this.component.active;
            }

            @HostListener('click') _host_on_click(e) {
                return this.component.clickHandler(e);
            }

    constructor() {
        this.component = new ToggleButtonComponent({
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
    declarations: [IlToggleButtonComponent],
    exports: [IlToggleButtonComponent]
})
export class IlToggleButtonModule {}
