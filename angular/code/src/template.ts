import {
    Injectable,
    TemplateRef,
    Directive,
    OnInit,
    Input,
    ViewContainerRef,
    NgModule,
    EmbeddedViewRef
} from '@angular/core';

export class IlTemplateContext {
    public $implicit: any;
}

@Injectable()
export class IlTemplateHost {
    public template: TemplateRef<IlTemplateContext> 
}

@Directive({
    selector: '[ilTemplateHost][ilTemplateHostData]'
})
export class IlTemplateHostDirective implements OnInit {
    @Input('ilTemplateHostData')
    set data(value: any) {
        this.storedData = value;
        if (this.embededViewRef)
            this.embededViewRef.context.$implicit = value;
    };

    private storedData: any;
    private embededViewRef: EmbeddedViewRef<IlTemplateContext>

    constructor(private viewContainer: ViewContainerRef, defaultTemplate: TemplateRef<IlTemplateContext>, private templateHost: IlTemplateHost) {
        if(!templateHost.template) 
            templateHost.template = defaultTemplate
    }

    ngOnInit() {
        this.embededViewRef = this.viewContainer.createEmbeddedView(this.templateHost.template, { '$implicit': this.storedData });
    }
}

@Directive({
    selector: '[ilTemplate]'
})
export class IlTemplateDirective {
    @Input('ilTemplateOf') name: string;

    constructor(template: TemplateRef<IlTemplateContext>, templateHost: IlTemplateHost) {
        templateHost.template = template
    }
}

@NgModule({
    declarations: [IlTemplateHostDirective, IlTemplateDirective],
    exports: [IlTemplateHostDirective, IlTemplateDirective]
})
export class IlTemplateModule {}