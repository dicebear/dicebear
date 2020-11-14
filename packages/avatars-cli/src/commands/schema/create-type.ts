import { compile } from 'json-schema-to-typescript';
import globby from 'globby';
import path from 'path';
import fs from 'fs-extra';

interface Options {
  input: string;
}

export default async function (options: Options) {
  const cwd = process.cwd();
  const paths = await globby([options.input], { cwd });

  for (let i = 0; i < paths.length; i++) {
    let filePath = path.join(cwd, paths[i]);

    let content = await compile(require(filePath), 'Options', {
      cwd: path.dirname(filePath),
    });

    await fs.writeFile(path.join(path.dirname(filePath), 'options.ts'), content);
  }
}
