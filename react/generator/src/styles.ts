import postcss = require('postcss');
import { readFile } from 'fs';
import { uniqTag } from './utils';

export async function styles(stylesPath: string, hostTag: string): Promise<string> {
    return new Promise<string>((resolve) => {
        readFile(stylesPath, (err, data) => {
            postcss()
                .use(postcss.plugin('emulated-shadow', function (opts) {
                    opts = opts || {};
                    return function (root, result) {
                        root.walkRules(rule => {
                            rule.selector = rule.selector.replace(
                                /:host/g,
                                `[${uniqTag(hostTag)}]`
                            );
                            rule.selector = rule.selector.replace(
                                /::slotted\(([^\)]*)\)/g,
                                (_, slotted) => `[${uniqTag(hostTag)}] [${uniqTag(slotted)}]`
                            );
                        });
                    };
                }))
                .process(data)
                .then(function (result) {
                    resolve(result.css)
                });
        })
    });
}