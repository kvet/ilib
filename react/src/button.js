
import { Component, createElement } from 'react';
import { CoreComponent } from 'ilib/button';
import './button.css';

export class Button extends Component {
    constructor(props) {
        super(props);

        this.component = new CoreComponent({
            emitEvent: (name, e) => {
                this.props[name] && this.props[name](e);
            },
            getProp: (name) => this.props[name]
        });
    }
    render() {
        return  createElement(
        'button',
        {
            'data-host-abc': true,
            className: this.props.className + ' ' + (this.component.disabled ? 'disabled ' : ''),
            onClick:this.component.clickHandler.bind(this.component),
        },
        this.props.children
    )
    }
}