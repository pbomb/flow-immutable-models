// @flow
import fs from 'fs';
import jscodeshift from 'jscodeshift';
import transform from '../transform';

export default function transformFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = fs.readFile(filename, (err, source) => {
      if (err) {
        reject(err);
        return;
      }
      const output = transform({
        path: file,
        source: source.toString(),
      }, {
        jscodeshift,
        stats: () => {},
      }, {});
      resolve(output.toString());
    });
  });
}
