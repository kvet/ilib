exports.CoreComponent = class {
    constructor(wrapper) {
        this._wrapper = wrapper;
    }

    get disabled() {
        return this._wrapper.getProp('disabled');
    }

    clickHandler(e) {
        if(!this.disabled) {
            this._wrapper.emitEvent('onClick', e);
        }
    }
};

exports.template = (e) => { 
    return e('div', e.contentPlaceholder(), { 
        classes: [{ name: 'disabled', getter: 'disabled' }],
        events: [{ name: 'click', handler: 'clickHandler' }]
    });
};
exports.styles = `
    div { display: inline-block; border: 1px solid red; padding: 10px 5px; transition: all linear .2s; }
    .disabled { border: 1px solid gray; }
`;
exports.events = ['onClick']
exports.props = {
    disabled: false
}