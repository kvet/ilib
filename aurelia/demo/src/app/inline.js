import { bindable, bindingMode, InlineViewStrategy } from 'aurelia-framework';

export class Inline {

    viewStrategy;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    template;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    displayValue;

    attached() {
        this.render();
    }

    templateChanged() {
        this.render();
    }

    render() {
        this.viewStrategy = new InlineViewStrategy(`<template>${this.template}</template>`);
    }
}