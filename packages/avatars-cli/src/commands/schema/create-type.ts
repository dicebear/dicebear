import { compile } from 'json-schema-to-typescript';
import path from 'path';
import fs from 'fs-extra';

interface Options {
  input: string;
  output: string;
}

export default async function ({ input, output }: Options) {
  let filePath = path.join(process.cwd(), input);

  let content = await compile(require(filePath), 'Options', {
    cwd: path.dirname(filePath),
  });

  await fs.writeFile(path.join(process.cwd(), output), content);
}
