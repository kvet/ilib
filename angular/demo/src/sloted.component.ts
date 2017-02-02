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
import { CommonModule } from '@angular/common'

// Slots

@Component({
    selector: 'slotted',
    template: (
        `<span #fullName><ng-content select="[full-name]"></ng-content></span>
        <span *ngIf="fullName.childNodes.length == 0">
            <span #firstName><ng-content select="[first-name]"></ng-content></span>
            <span *ngIf="firstName.childNodes.length == 0">d:firstName</span>
            <span #lastName><ng-content select="[last-name]"></ng-content></span>
            <span *ngIf="lastName.childNodes.length == 0">d:lastName</span>
        </span>`
        ),
    styles: [`:host { display: block; }`]
})
export class SlotedComponent {}

// Scoped slots

@Injectable()
export class ScopedSlottesHost {
    public templates: { [key: string]: TemplateRef<any> } = {}
}

@Directive({
    selector: '[scopedSlottedHost][scopedSlottedHostData][scopedSlottedHostName]'
})
export class ScopedSlottedHostDirective implements OnInit {
    @Input('scopedSlottedHostData') data: any;
    name: string;
    @Input('scopedSlottedHostName') set _name(value) {
        this.name = value;
        if(!this.templateHost.templates[value]) 
            this.templateHost.templates[value] = this.defaultTemplate
    };

    constructor(private viewContainer: ViewContainerRef, private defaultTemplate: TemplateRef<any>, private templateHost: ScopedSlottesHost) {}

    ngOnInit() {
        this.viewContainer.createEmbeddedView(this.templateHost.templates[this.name], { '$implicit': this.data });
    }
}

@Directive({
    selector: '[scopedSlotted][scopedSlottedOf]'
})
export class ScopedSlottedDirective {
    @Input('scopedSlottedOf') set name(value) {
        this.templateHost.templates[value] = this.template
    };

    constructor(private template: TemplateRef<any>, private templateHost: ScopedSlottesHost) {}
}

@Component({
    selector: 'scoped-slotted',
    providers: [ScopedSlottesHost],
    template: (
        `<template scopedSlottedHost scopedSlottedHostName="fullName" let-data [scopedSlottedHostData]="{ data: 'a:fullName' }">
            <template scopedSlottedHost scopedSlottedHostName="firstName" let-data [scopedSlottedHostData]="{ data: 'a:firstName' }">d:firstName</template>
            <template scopedSlottedHost scopedSlottedHostName="lastName" let-data [scopedSlottedHostData]="{ data: 'a:lastName' }">d:lastName</template>
        </template>`),
    styles: [`:host { display: block; }`]
})
export class ScopedSlottedComponent {}

@NgModule({
    imports: [CommonModule],
    declarations: [SlotedComponent, ScopedSlottedComponent, ScopedSlottedDirective, ScopedSlottedHostDirective],
    exports: [SlotedComponent, ScopedSlottedComponent, ScopedSlottedDirective]
})
export class SlottedModule {}
