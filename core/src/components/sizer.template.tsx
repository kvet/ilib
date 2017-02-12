import { h } from '../definitions.template';

export let template = (
    <h.domNode tag="div" ref="root">
        <h.template dataFields={{
            width: h.stateGetter('width'),
            height: h.stateGetter('height')
        }}>{(getter, handler) =>
            <h.domNode tag="div"/>
        }</h.template>
    </h.domNode>
);