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
    :host.disabled { border: 1px solid gray; }
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

@NgModule({
    declarations: [MyButtonComponent],
    exports: [MyButtonComponent]
})
export class MyButtonModule {}
