import { Node, templateBuilder as tb } from '../definitions.template';

export let template: Node = 
    tb.domNode(
        'button',
        [
            tb.classToggle('disabled', tb.propGetter('disabled')),
            tb.eventListener(tb.domEvent('click'), tb.componentHandler('clickHandler'))
        ],
        tb.slot()
    );