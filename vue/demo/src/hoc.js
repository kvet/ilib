export const HOCProvider = {
    //functional: true,
    render(h) {
        let child = this.$slots.default[0];
        child.componentOptions.propsData.string = 'hello';
        return child
    }
};

export const HOCTransformer = {
    //functional: true,
    props: ['string'],
    render(h) {
        let child = this.$slots.default[0];
        child.componentOptions.propsData.value = this.$props.string.toUpperCase();
        return child
    }
};

export const HOCDestination = {
    props: ['value'],
    template: (`<span>Result ('HELLO' expected): {{value}}</span>`)
};