import { Node, templateBuilder as tb } from '../definitions.template';

export let template: Node =
    tb.domNode(
        'div',
        [],
        tb.slot()
    );