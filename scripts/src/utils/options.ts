import fs from 'fs-extra';
import yaml from 'yaml';
import path from 'path';
import { Options } from '../types';

export async function read(): Promise<Options> {
  let options = await yaml.parse(
    await fs.readFile(path.resolve(__dirname, '../../config.yml'), {
      encoding: 'utf-8',
    })
  );

  let optionsStr = JSON.stringify(options);

  Object.keys(process.env).forEach((key) => {
    optionsStr = optionsStr.replace(new RegExp(`{{process.env.${key}}}`, 'g'), process.env[key] as any);
  });

  return JSON.parse(optionsStr);
}
