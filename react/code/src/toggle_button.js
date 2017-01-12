
import { Component, createElement } from 'react';
import { ToggleButtonComponent } from 'ilib';
import './toggle_button.css';

export class ToggleButton extends Component {
    constructor(props) {
        super(props);

        this.component = new ToggleButtonComponent({
            emitEvent: (name, e) => {
                this.props[name] && this.props[name](e);
            },
            getProp: (name) => this.props[name],
            setProp: () => {}
        });
    }
    render() {
        return  createElement(
            'button',
            {
                'data-host-abc2': true,
                className: (this.props.className || '') + ' ' + (this.component.disabled ? 'disabled ' : '') + (this.component.active ? 'active ' : ''),
            onClick:this.component.clickHandler.bind(this.component),
            },
            this.props.children
        )
    }
}