import { compile } from 'json-schema-to-typescript';
import path from 'path';
import fs from 'fs-extra';
import ts from 'ts-node';

export async function createTypes(input: string, output?: string): Promise<string> {
  let filePath = path.join(process.cwd(), input);
  let tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  let tsConfig = require(tsConfigPath);

  tsConfig['compilerOptions'] = tsConfig['compilerOptions'] || {};
  tsConfig['compilerOptions'].module = 'commonjs';

  ts.register(tsConfig);

  let raw = require(filePath);
  let content = await compile(raw.default || raw.schema || raw, 'Options', {
    cwd: path.dirname(filePath),
  });

  if (output) {
    await fs.writeFile(path.join(process.cwd(), output), content);
  }

  return content;
}
