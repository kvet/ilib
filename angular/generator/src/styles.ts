import postcss = require('postcss');
import { readFile } from 'fs';
import { dasherize, underscore } from 'inflection';

export async function styles(stylesPath: string): Promise<string> {
    return new Promise<string>((resolve) => {
        readFile(stylesPath, (err, data) => {
            postcss()
                .use(postcss.plugin('emulated-shadow', function (opts) {
                    opts = opts || {};
                    return function (root, result) {
                        root.walkRules(rule => {
                            rule.selector = rule.selector.replace(
                                /::slotted\(([^\)]*)\)/g,
                                (_, slotted) => `:host >>> [ilib-${dasherize(underscore(slotted))}]`
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