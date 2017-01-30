import {
    Component,
    NgModule,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
    Directive,
    Injectable,
    OnInit,
    ViewContainerRef,
    TemplateRef
} from '@angular/core';

@Injectable()
export class MyTemplateHost {
    public template: TemplateRef<any> 
}

@Directive({
    selector: '[myTemplateHost][myTemplateHostData]'
})
export class MyTemplateHostDirective implements OnInit {
    @Input('myTemplateHostData') data: any;

    constructor(private viewContainer: ViewContainerRef, defaultTemplate: TemplateRef<any>, private templateHost: MyTemplateHost) {
        if(!templateHost.template) 
            templateHost.template = defaultTemplate
    }

    ngOnInit() {
        this.viewContainer.createEmbeddedView(this.templateHost.template, { '$implicit': this.data });
    }
}

@Directive({
    selector: '[myTemplate][myTemplateOf]'
})
export class MyTemplateDirective {
    @Input('myTemplateOf') name: string;

    constructor(template: TemplateRef<any>, private templateHost: MyTemplateHost) {
        templateHost.template = template
    }
}

@Component({
    selector: 'my-button',
    providers: [MyTemplateHost],
    template: `<template myTemplateHost let-data [myTemplateHostData]="{ text: 'Hello!' }">{{data.text}}</template>`,
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

@NgModule({
    declarations: [MyButtonComponent, MyTemplateHostDirective, MyTemplateDirective],
    exports: [MyButtonComponent, MyTemplateDirective]
})
export class MyButtonModule {}
