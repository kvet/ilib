import { h } from '../definitions.template';

export let template = (
    <h.domNode tag="button"
        classNames={{ disabled: h.propGetter('disabled') }}
        eventListeners={{ click: h.componentHandler('clickHandler') }}>
        <h.slot/>
    </h.domNode>
);