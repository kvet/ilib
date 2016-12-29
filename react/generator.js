let fs = require('fs');
let path = require('path');
let button = require('../core/src/button');

let cap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let stringifyTemplate = (tag, content, attrs) => {
    let classes = (attrs.classes || []).map((klass) => {
        return `(this.component.${klass.getter} ? '${klass.name} ' : '')`;
    }).join(' + ');
    let events = (attrs.events || []).map((event) => {
        return {
            event: `on${cap(event.name)}`,
            handler: `this.component.${event.handler}.bind(this.component)`
        };
    });

    return ` createElement(
        '${tag}',
        {
            'data-host-abc': true,
            className: this.props.className + ' ' + ${classes},
${
events.map((event) => {
    return `            ${event.event}:${event.handler},`;
}).join('\n')
}
        },
        ${content}
    )`;
};
stringifyTemplate.contentPlaceholder = () => {
    return 'this.props.children';
};

let stringifyStyles = () => {};
stringifyStyles.host = () => '[data-host-abc]';

fs.writeFileSync(path.resolve(__dirname, './dist/button.css'), button.styles(stringifyStyles));

fs.writeFileSync(path.join(__dirname, './src/button.js'), `
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
        return ${button.template(stringifyTemplate)}
    }
}`)