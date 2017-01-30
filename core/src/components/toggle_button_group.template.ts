import { Node, templateBuilder as tb } from '../definitions.template';

export let template: Node =
    tb.domNode(
        'div',
        [],
        tb.domNode(
            tb.componentTag('ButtonGroup'),
            [],
            tb.forTemplate(tb.propGetter('items'), (value, index) => 
                tb.template(
                    {
                        active: tb.componentCall('isActive', index()),
                        activate: tb.componentHandler('activate', index()),
                        item: value(),
                        index: index()
                    },
                    (getter, handler) =>
                        tb.domNode(
                            tb.componentTag('ToggleButton'),
                            [
                                tb.attr('active', getter('active')),
                                tb.eventListener('onClick', handler('activate'))
                            ],
                            tb.textNode(getter('item'))
                        )
                )
            )
        )
    );