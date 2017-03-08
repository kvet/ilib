import { unique } from 'shorthash';
import { dasherize, underscore } from 'inflection';

const HOST_TAG = "data-ilibhost-";

export function uniqTag(component) {
    return `${HOST_TAG}${unique(dasherize(underscore(component)))}`
}