import { bindable } from 'aurelia-framework';

export class List
{
    @bindable
    rows = [{name: "John"}];
}