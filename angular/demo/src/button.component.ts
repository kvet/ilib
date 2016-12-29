import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';

@Component({
    selector: 'my-button',
    template: `<ng-content></ng-content>`,
    styles: [`
    :host { display: inline-block; border: 1px solid red; padding: 10px 5px; transition: all linear .2s; }
    :host.disabled { border: 1px solid gray; }
`]
})
export class MyButtonComponent implements OnChanges, DoCheck {
    component: any;

    @Input() disabled = false;
    @Output() onClick = new EventEmitter();

    @HostBinding('class.disabled') disabledClass = this.disabled;
    @HostListener('click') onClickHandler(e) {
        if(!this.disabled)
            this.onClick.emit(e);
    };

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);

        if('disabled' in changes) {
            this.disabledClass = changes['disabled'].currentValue;
        }
    }

    ngDoCheck() {
        this.disabledClass = this.disabled;
    }
}

@NgModule({
    declarations: [MyButtonComponent],
    exports: [MyButtonComponent]
})
export class MyButtonModule {}
