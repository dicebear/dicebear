import { Style } from '@dicebear/core';
import type { AvatarStyles } from '@theme/types';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { findUncategorizedStyles } from '../theme/config/styleCategories.ts';

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
  const rawDefinition = fs.readFileSync(
    path.join(definitionsDir, file),
    'utf-8',
  );
  const definition = JSON.parse(rawDefinition);
  const style = new Style(definition);
  const meta = style.meta();

  avatarStyles[name] = {
    definitionUrl: style.id(),
    animated: rawDefinition.includes('@keyframes'),
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

const uncategorized = findUncategorizedStyles(Object.keys(avatarStyles));

if (uncategorized.length > 0) {
  throw new Error(
    `These styles have no category: ${uncategorized.join(', ')}. ` +
      'Add them to .vitepress/theme/config/styleCategories.ts.',
  );
}

/**
 * How many styles @dicebear/styles ships. Every headline, meta description and
 * marketing line that names a number reads it from here, so shipping a style
 * updates the copy on its own. Frontmatter cannot import, so those pages write
 * {@link STYLE_COUNT_TOKEN} instead and the build fills it in.
 */
export const styleCount = Object.keys(avatarStyles).length;

/**
 * How many of those styles ship an animation. Derived from the same
 * `@keyframes` probe that sets the per-style `animated` flag above.
 */
export const animatedStyleCount = Object.values(avatarStyles).filter(
  (style) => style.animated,
).length;

export const STYLE_COUNT_TOKEN = '%STYLE_COUNT%';

export default avatarStyles;
