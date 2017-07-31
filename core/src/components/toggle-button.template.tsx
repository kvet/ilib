import { h, Node } from '../definitions.template';
import { toggleButtonComponentMetadata } from './toggle-button';

export let template = h.component(toggleButtonComponentMetadata, (
    { disabled, active },
) => (
    <h.domNode tag="button"
        classNames={{ disabled, active }}
        eventListeners={{ click: h.componentHandler('clickHandler') }}>
        <h.slot/>
    </h.domNode>
));