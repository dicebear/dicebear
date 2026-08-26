/**
 * Checks the editor's option labels in src/messages/*.json against the styles
 * in src/config/styles.ts.
 *
 * Three things go wrong quietly here. A style ships and its option keys have no
 * label, which shows the reader a raw `shouldersVariant`. Two keys in the same
 * style resolve to the same word, which puts two identical tabs in one strip
 * and gives no way to tell them apart. And a per-style override outlives the
 * key it was written for, so the wording someone chose deliberately stops
 * being used and nothing says so.
 *
 * Usage: node scripts/validate-messages.mjs
 */
import { OptionsDescriptor, Style } from '@dicebear/core';
import { camelCase } from 'change-case';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const require = createRequire(import.meta.url);
const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)));

const LANGUAGES = ['en', 'de', 'pt'];

// Kept out of the editor by getSchemaOptions, because the export is static.
const HIDDEN = new Set(['animationVariant']);

const problems = [];

const source = readFileSync(path.join(root, 'src/config/styles.ts'), 'utf8');
const styleNames = [
  ...source.matchAll(/from '@dicebear\/styles\/([a-z0-9-]+)\.json'/g),
].map((match) => match[1]);

if (styleNames.length === 0) {
  console.error('No styles found in src/config/styles.ts');
  process.exit(1);
}

const messages = Object.fromEntries(
  LANGUAGES.map((language) => [
    language,
    JSON.parse(
      readFileSync(path.join(root, `src/messages/${language}.json`), 'utf8'),
    ),
  ]),
);

/** Mirrors `label()` in components/OptionsTabs.vue. */
function label(message, styleKey, key) {
  return message.styles?.[styleKey]?.[key] ?? message[key];
}

/** The option keys the editor draws a tab for, in the order it draws them. */
function labelledKeys(styleName) {
  const style = new Style(require(`@dicebear/styles/${styleName}.json`));
  const descriptor = new OptionsDescriptor(style).toJSON();

  return Object.entries(descriptor)
    .filter(([key, field]) => {
      if (HIDDEN.has(key)) {
        return false;
      }

      return (
        field.type === 'color' ||
        (field.type === 'enum' && field.weighted === true)
      );
    })
    .map(([key]) => key);
}

const reached = new Set();

for (const styleName of styleNames) {
  const styleKey = camelCase(styleName);
  const keys = labelledKeys(styleName);

  for (const language of LANGUAGES) {
    const message = messages[language];
    const byLabel = new Map();

    for (const key of keys) {
      if (message.styles?.[styleKey]?.[key] !== undefined) {
        reached.add(`${language}.${styleKey}.${key}`);
      }

      const text = label(message, styleKey, key);

      if (text === undefined) {
        problems.push(
          `${language}: "${key}" has no label, needed by ${styleName}`,
        );
        continue;
      }

      byLabel.set(text, [...(byLabel.get(text) ?? []), key]);
    }

    for (const [text, sharing] of byLabel) {
      if (sharing.length > 1) {
        problems.push(
          `${language}: ${styleName} draws two tabs both reading "${text}" (${sharing.join(', ')}). ` +
            `Give one of them a "styles.${styleKey}" override.`,
        );
      }
    }
  }
}

for (const language of LANGUAGES) {
  for (const [styleKey, overrides] of Object.entries(
    messages[language].styles ?? {},
  )) {
    for (const [key, text] of Object.entries(overrides)) {
      const id = `${language}.styles.${styleKey}.${key}`;

      if (!reached.has(`${language}.${styleKey}.${key}`)) {
        problems.push(`${id} overrides a label no style asks for any more`);
      }

      if (text === messages[language][key]) {
        problems.push(`${id} repeats the shared label and can be deleted`);
      }
    }
  }
}

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`  ${problem}`);
  }

  console.error(`\n${problems.length} problem(s) in src/messages.`);
  process.exit(1);
}

console.log(
  `${styleNames.length} styles x ${LANGUAGES.length} languages checked, ` +
    `${reached.size} per-style override(s) in use.`,
);
