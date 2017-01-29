import { Node, templateBuilder as tb } from '../template_definitions';

export let template: Node =
    tb.domNode(
        'div',
        [],
        tb.slot()
    );