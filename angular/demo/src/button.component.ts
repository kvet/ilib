import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    HostListener
} from '@angular/core';

@Component({
    selector: 'my-button',
    template: `<ng-content></ng-content>`,
    styles: [`
    :host { display: inline-block; border: 1px solid red; padding: 10px 5px; transition: all linear .2s; }
    :host(.disabled) { border: 1px solid gray; }
`]
})
export class MyButtonComponent {
    component: any;

    @Input() disabled = false;
    @Output() onClick = new EventEmitter();

    @HostBinding('class.disabled') get disabledClass() {
        return this.disabled;
    };
    @HostListener('click') onClickHandler(e) {
        if(!this.disabled)
            this.onClick.emit(e);
    };
}

@Component({
    selector: 'my-button-group',
    template: `<ng-content select="my-button"></ng-content>`,
    styles: [`
    :host { display: inline-block; }
    :host-context(.theme-lime) {
        :host {
            bg: lime;
        }
    }
    :host >>> my-button { border-color: brown; }
    :host >>> my-button:first-child { border-radius: 3px 0 0 3px; }
    :host >>> my-button:last-child { border-radius: 0 3px 3px 0; }
    :host >>> my-button:not(:first-child) { margin-left: -1px; }
`]
})
export class MyButtonGroupComponent {
}

@NgModule({
    declarations: [MyButtonComponent, MyButtonGroupComponent],
    exports: [MyButtonComponent, MyButtonGroupComponent]
})
export class MyButtonModule {}
