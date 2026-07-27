import { Style } from '@dicebear/core';
import { AvatarStyles } from '@theme/types';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as fs from 'node:fs';

const require = createRequire(import.meta.url);

/**
 * Where the packaged `.min.json` definitions live. Exported so other config
 * modules resolve them the same way instead of repeating the anchor file.
 */
export const definitionsDir = path.dirname(
  require.resolve('@dicebear/styles/initials.json'),
);

const avatarStyles: AvatarStyles = {};

for (const file of fs.readdirSync(definitionsDir)) {
  if (!file.endsWith('.min.json')) {
    continue;
  }

  const name = file.replace('.min.json', '');
  const definition = JSON.parse(
    fs.readFileSync(path.join(definitionsDir, file), 'utf-8'),
  );
  const style = new Style(definition);
  const meta = style.meta();

  avatarStyles[name] = {
    definitionUrl: style.id(),
    meta: {
      title: meta.source().name(),
      creator: meta.creator().name(),
      homepage: meta.creator().url(),
      source: meta.source().url(),
      license: {
        name: meta.license().name(),
        url: meta.license().url(),
        text: meta.license().text(),
      },
    },
  };
}

export default avatarStyles;
