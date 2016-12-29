import { Component, createElement } from 'react';
import { CoreComponent, template, styles } from 'ilib/button';
import './button.css';

let cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        let stringifyTemplate = (tag, content, attrs) => {
            let classes = (attrs.classes || []).map((klass) => {
                return this.component[klass.getter] ? klass.name : '';
            }).join(' ');
            let events = (attrs.events || []).reduce((result, event) => {
                result[`on${cap(event.name)}`] = this.component[event.handler].bind(this.component)
                return result;
            }, {});
            return createElement(tag, Object.assign({
                className: classes,
                'data-host-abc': true
            }, events), content)
        };
        stringifyTemplate.contentPlaceholder = () => {
            return this.props.children;
        };

        return template(stringifyTemplate)
    }
}