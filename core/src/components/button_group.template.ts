import { Node, templateBuilder as tb } from '../template_definitions';

export let template = 
    tb.node(
        'div',
        [],
        tb.contentPlaceholder()
    );