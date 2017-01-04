import * as fs from 'fs';
import * as path from'path';
import * as ilib from '../../../core/dist';

let cap = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let stringifyTemplate = {
    host: (tag, content, attrs) => {
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
    },
    contentPlaceholder: () => 'this.props.children'
};

let stringifyStyles = {
    host: () => '[data-host-abc]'
};

for (let definition of ilib.definitions) {
    let metadata: ilib.ComponentMetadata = ilib[definition.metadata];
    let template = metadata.template(stringifyTemplate);
    let styles = metadata.styles(stringifyStyles);

    let content = `
import { Component, createElement } from 'react';
import { ${definition.component} } from 'ilib/button';
import './button.css';

export class Button extends Component {
    constructor(props) {
        super(props);

        this.component = new ${definition.component}({
            emitEvent: (name, e) => {
                this.props[name] && this.props[name](e);
            },
            getProp: (name) => this.props[name]
        });
    }
    render() {
        return ${template}
    }
}`;
    fs.writeFileSync(path.resolve(__dirname, `../../src/${definition.fileName}.js`), content);
    fs.writeFileSync(path.resolve(__dirname, `../../dist/${definition.fileName}.css`), styles);
}