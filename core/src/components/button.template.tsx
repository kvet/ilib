import { h, Node } from '../definitions.template';
import { buttonComponentMetadata } from './button';

export let template = h.component(buttonComponentMetadata, (
    { disabled },
) => (
    <h.domNode tag="button"
        classNames={{ disabled }}
        eventListeners={{ click: h.componentHandler('clickHandler') }}>
        <h.slot/>
    </h.domNode>
));