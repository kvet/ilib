import { h } from '../definitions.template';

export let template = (
    <h.domNode tag="div">
        <h.componentNode name="ButtonGroup">
            <h.forTemplate of={h.propGetter('items')}>{(value, index) =>
                <h.template dataFields={{ 
                    active: h.componentCall('isActive', index()),
                    activate: h.componentHandler('activate', index()),
                    item: value(),
                    index: index()
                }}>{(getter, handler) =>
                    <h.componentNode name="ToggleButton"
                        props={{ 'active': getter('active') }}
                        events={{ onClick: handler('activate') }}>
                        <h.textNode content={getter('item')}/>
                    </h.componentNode>
                }</h.template>
            }</h.forTemplate>
        </h.componentNode>
    </h.domNode>
);