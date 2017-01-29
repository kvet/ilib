import { Node, templateBuilder as tb } from '../definitions.template';

export let template: Node =
    tb.domNode(
        'div',
        [],
        tb.domNode(
            tb.componentTag('ButtonGroup'),
            [],
            tb.forTemplate(tb.propGetter('items'), (value, index) => 
                tb.domNode(
                    tb.componentTag('ToggleButton'),
                    [
                        tb.attr('active', tb.componentCall('isActive', index())),
                        tb.eventListener('onClick', tb.componentHandler('activate', index()))
                    ],
                    tb.textNode(value())
                )
            )
        )
    );