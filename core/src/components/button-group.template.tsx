import { h, Node } from '../definitions.template';
import { buttonGroupComponentMetadata } from './button-group';

export let template = h.component(buttonGroupComponentMetadata, () => (
    <h.domNode tag="div">
        <h.slot/>
    </h.domNode>
));