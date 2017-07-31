import { h, Node } from '../definitions.template';
import { sizerComponentMetadata } from './sizer';

export let template = h.component(sizerComponentMetadata, (
    {},
    { width, height }
) => (
    <h.domNode tag="div" ref="root">
        <h.template width={width} height={height}>{() =>
            <h.domNode tag="div"/>
        }</h.template>
    </h.domNode>
));