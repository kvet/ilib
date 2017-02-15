import { h } from '../definitions.template';

export let template = (
    <h.domNode tag="button"
        classNames={{ disabled: h.propGetter('disabled'), active: h.propGetter('active') }}
        eventListeners={{ click: h.componentHandler('clickHandler') }}>
        <h.slot/>
    </h.domNode>
);