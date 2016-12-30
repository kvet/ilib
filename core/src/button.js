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
    return e.host(
        'button',
        e.contentPlaceholder(),
        { 
            classes: [{ name: 'disabled', getter: 'disabled' }],
            events: [{ name: 'click', handler: 'clickHandler' }]
        }
    );
};
exports.styles = (e) => {
    return `
        ${e.host()} { 
            display: inline-block;
            border: 1px solid red;
            border-radius: 5px;
            padding: 5px 10px;
            transition: all linear .2s;
            color: #373a3c;
            background-color: #fff;
            border-color: #adadad;
        }
        ${e.host()}.disabled {
            cursor: not-allowed;
            opacity: .65;
        }
    `;
}
exports.events = ['onClick']
exports.props = {
    disabled: false
}