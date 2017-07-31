import { h, Node } from '../definitions.template';
import { toggleButtonGroupComponentMetadata } from './toggle-button-group';

let itemTemplate = ({ active, activate, item }) => (
    <h.componentNode name="ToggleButton"
        props={{ active }}
        events={{ onClick: activate }}>
        <h.textNode content={item}/>
    </h.componentNode>
)

export let template = h.component(toggleButtonGroupComponentMetadata, (
    { items },
) => (
    <h.domNode tag="div">
        <h.componentNode name="ButtonGroup">
            <h.forTemplate of={items}>{({ item, index }) =>
                <h.template
                    active={h.componentCall('isActive', index)}
                    activate={h.componentHandler('activate', index)}
                    item={item}
                    index={index}>
                    {itemTemplate}
                </h.template>
            }</h.forTemplate>
        </h.componentNode>
    </h.domNode>
));