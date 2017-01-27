import { Node, templateBuilder as tb } from '../template_definitions';

export let template = 
    tb.node(
        'div',
        [],
        tb.node(
            tb.componentTag('ButtonGroup'),
            [],
            tb.forLoop(tb.propGetter('items'), (value, index) => 
                tb.node(
                    tb.componentTag('ToggleButton'),
                    [
                        tb.attr('active', tb.componentCall('isActive', index())),
                        tb.eventListener('onClick', tb.componentHandler('activate', index()))
                    ],
                    tb.text(value())
                )
            )
        )
    );