import { h } from '../definitions.template';

export let template = (
    <h.domNode tag="div" ref="root">
        <h.template width={h.stateGetter('width')} height={h.stateGetter('height')}>{() =>
            <h.domNode tag="div"/>
        }</h.template>
    </h.domNode>
);