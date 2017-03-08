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
    TemplateRef,
    OpaqueToken,
    forwardRef,
    Inject,
    Self,
    Optional,
    EmbeddedViewRef
} from '@angular/core';

const TOKEN = new OpaqueToken('ololo');

@Directive({
    selector: '[hoc-provider]'
})
export class HocProviderDirective {
    constructor(viewContainer: ViewContainerRef, template: TemplateRef<any>, @Inject(TOKEN) @Self() @Optional() host: any) {
        console.log('ololo')
        host && (host.value = 'ololo')

        viewContainer.createEmbeddedView(template, { $implicit: 'hello' });
    }
}

@Directive({
    selector: '[hoc-transformer]'
})
export class HocTransformerDirective {
    private _data;
    private embededViewRef: EmbeddedViewRef<any>;

    @Input() set data(value: string) {
        this._data = value.toUpperCase();
        if (this.embededViewRef)
            this.embededViewRef.context.$implicit = this._data;
    };

    constructor(viewContainer: ViewContainerRef, template: TemplateRef<any>, @Inject(TOKEN) @Self() @Optional() host: any) {
        console.log('opapa')
        host && (host.value = 'opapa')

        this.embededViewRef = viewContainer.createEmbeddedView(template, { $implicit: this._data });
    }
}

@Component({
    selector: 'hoc-destination',
    template: `Result ('HELLO' expected): {{value}}`
})
export class HocDestinationComponent implements OnInit {
    constructor() {
        console.log('host')
    }

    ngOnInit() {
        console.log('host init')
    }

    @Input() value = '';
}

@NgModule({
    declarations: [HocDestinationComponent, HocProviderDirective, HocTransformerDirective],
    exports: [HocDestinationComponent, HocProviderDirective, HocTransformerDirective]
})
export class HocExampleModule {}