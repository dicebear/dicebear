import { Command } from 'commander';
import { rollup } from 'rollup';
import { PackageJson } from 'type-fest';
import { compileFromFile } from 'json-schema-to-typescript';
import { createUmdConfig } from '../build/createUmdConfig';
import { createCjsAndEsConfig } from '../build/createCjsAndEsConfig';
import { dereference } from '@apidevtools/json-schema-ref-parser';
import * as path from 'path';
import * as fs from 'fs-extra';

export async function makeProjectBuildCommand() {
  const cmd = new Command('build');

  cmd.arguments('<name>');

  cmd.action(async (name: string) => {
    const pkg: PackageJson = await import(path.resolve(process.cwd(), 'package.json'));

    const umdConfig = createUmdConfig(name, pkg);
    const cjsAndEsConfig = createCjsAndEsConfig(pkg);

    const schemaPath = path.resolve(process.cwd(), 'schema.json');

    if (await fs.pathExists(schemaPath)) {
      console.log('Create dereferences src/schema.ts from schema.json');

      const schema = await dereference(schemaPath);

      delete schema.definitions;

      await fs.writeFile(
        path.resolve(process.cwd(), 'src/schema.ts'),
        `
          import { StyleSchema } from '${pkg.name === '@dicebear/avatars' ? './types' : '@dicebear/avatars'}';
  
          export const schema: StyleSchema = ${JSON.stringify(schema)};
        `
          .replace(/^[ ]*/gm, '')
          .trim(),
        { encoding: 'utf-8' }
      );

      console.log('Create src/options.ts from schema.json');

      const schemaTypes = await compileFromFile(schemaPath);

      await fs.writeFile(path.resolve(process.cwd(), 'src/options.ts'), schemaTypes, { encoding: 'utf-8' });
    } else {
      console.log('schema.json not found - skip dereferencing');
      console.log('schema.json not found - skip creation src/options.ts');
    }

    console.log('Bundle package with rollup');

    await Promise.all(
      [umdConfig, cjsAndEsConfig].map(async ({ input, output }) => {
        const bundle = await rollup(input);

        await Promise.all(output.map((output) => bundle.write(output)));

        await bundle.close();
      })
    );
  });

  return cmd;
}
