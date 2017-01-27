import { Node, templateBuilder as tb } from '../template_definitions';

export let template = 
    tb.node(
        'button',
        [
            tb.classToggle('disabled', tb.propGetter('disabled')),
            tb.eventListener(tb.domEvent('click'), tb.componentHandler('clickHandler'))
        ],
        tb.contentPlaceholder()
    );