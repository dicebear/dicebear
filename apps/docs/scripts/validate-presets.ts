/**
 * Checks the preset gallery data in .vitepress/theme/presets/*.json against the
 * installed @dicebear/styles.
 *
 * Presets are frozen option sets, so they rot quietly: a renamed component
 * leaves a `<name>Variant` option that no longer matches anything, and the
 * component simply stops appearing. Nothing in the docs build would notice.
 * This script does.
 *
 * Usage: node scripts/validate-presets.ts
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { Avatar, OptionsDescriptor, Style } from '@dicebear/core';
import type { StylePreset } from '../.vitepress/theme/config/presets.ts';
import { previewRowSeeds } from '../.vitepress/theme/config/previewRowSeeds.ts';

const presetsDir = fileURLToPath(
  new URL('../.vitepress/theme/presets', import.meta.url),
);

// A handful of seeds rather than one: a preset can be valid for the variant a
// single seed happens to draw and broken for the next.
const PROBE_SEEDS = ['Felix', 'Aneka', 'Milo', 'Luna', 'Dara', 'Erik'];

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Copied from `unsupportedHttpApiOptions` in theme/utils/avatar/api.ts rather
// than imported: that module reaches `../escape` without a file extension, which
// Vite resolves and plain Node does not. Keep the two lists in step by hand.
const HTTP_API_DROPS = new Set([
  'idRandomization',
  'fontFamily',
  'fontWeight',
  'title',
]);

const errors: string[] = [];
const warnings: string[] = [];

function error(file: string, message: string) {
  errors.push(`${file}: ${message}`);
}

function warn(file: string, message: string) {
  warnings.push(`${file}: ${message}`);
}

// Resolved through the package exports rather than a dist path, so a preset
// file named after a style that no longer ships fails right here.
function loadDefinition(styleName: string) {
  const url = import.meta.resolve(`@dicebear/styles/${styleName}.json`);

  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8'));
}

function validatePreset(
  file: string,
  preset: Partial<StylePreset>,
  style: Style,
  descriptor: ReturnType<OptionsDescriptor['toJSON']>,
  seenIds: Set<string>,
) {
  const label = preset.id ?? '(unnamed)';

  for (const field of ['id', 'name', 'summary', 'description'] as const) {
    const value = preset[field];

    if (typeof value !== 'string' || value.trim() === '') {
      error(file, `preset "${label}" is missing a non-empty "${field}"`);
    }
  }

  if (typeof preset.id === 'string' && !KEBAB_CASE.test(preset.id)) {
    error(file, `preset id "${preset.id}" is not kebab-case`);
  }

  if (preset.id !== undefined) {
    if (seenIds.has(preset.id)) {
      error(file, `duplicate preset id "${preset.id}"`);
    }

    seenIds.add(preset.id);
  }

  if (typeof preset.options !== 'object' || preset.options === null) {
    error(file, `preset "${label}" has no options object`);

    return;
  }

  if (Object.keys(preset.options).length === 0) {
    error(file, `preset "${label}" sets no options`);
  }

  for (const [key, value] of Object.entries(preset.options)) {
    const field = descriptor[key];

    if (!field) {
      error(
        file,
        `preset "${label}" sets "${key}", which this style does not accept`,
      );

      continue;
    }

    // The style page advertises an HTTP-API URL next to every preset, so an
    // option the deployed API does not know yet would render differently there
    // than in the gallery.
    if (key.endsWith('ColorOrder')) {
      warn(
        file,
        `preset "${label}" uses "${key}", which the public HTTP API does not serve yet`,
      );
    }

    // A preset that sets one of these would advertise an HTTP-API call that
    // renders something else.
    if (HTTP_API_DROPS.has(key)) {
      warn(
        file,
        `preset "${label}" uses "${key}", which the generated HTTP-API URL silently drops`,
      );
    }

    if (field.type === 'enum' && !field.open) {
      const names = Array.isArray(value)
        ? value
        : typeof value === 'object' && value !== null
          ? Object.keys(value)
          : [value];

      for (const name of names) {
        if (!field.values.includes(String(name))) {
          error(
            file,
            `preset "${label}" sets ${key}="${name}", which this style no longer has`,
          );
        }
      }
    }
  }

  // The real check: render it. This runs the same option validation and the
  // same resolver the libraries use, so an unsatisfiable colour constraint or
  // a value out of range fails here rather than in a user's browser.
  for (const seed of PROBE_SEEDS) {
    let svg;

    try {
      svg = new Avatar(style, { seed, ...preset.options }).toString();
    } catch (err) {
      error(
        file,
        `preset "${label}" fails to render with seed "${seed}": ${(err as Error).message}`,
      );

      return;
    }

    if (!svg.includes('<use ')) {
      error(
        file,
        `preset "${label}" renders an empty avatar with seed "${seed}": a probability or variant option removed everything`,
      );

      return;
    }
  }
}

const files = readdirSync(presetsDir).filter((name) => name.endsWith('.json'));

if (files.length === 0) {
  console.error(`No preset files found in ${presetsDir}`);
  process.exit(1);
}

let presetCount = 0;

for (const file of files.sort()) {
  const styleName = file.slice(0, -'.json'.length);

  let definition;

  try {
    definition = loadDefinition(styleName);
  } catch {
    error(
      file,
      `no style named "${styleName}" in the installed @dicebear/styles`,
    );
    continue;
  }

  // StylePresets.vue draws every tile with the style's preview row, and
  // getPreviewRowSeeds throws rather than inventing seeds. Without this check
  // the gap only surfaces when vitepress renders the gallery page, where the
  // error names the seed table and not the preset file that pulled it in.
  if (!previewRowSeeds[styleName]) {
    error(
      file,
      `no preview row seeds for "${styleName}"; re-run scripts/generate-preview-seeds.ts`,
    );
    continue;
  }

  const style = new Style(definition);
  const descriptor = new OptionsDescriptor(style).toJSON();
  const parsed = JSON.parse(readFileSync(path.join(presetsDir, file), 'utf8'));

  if (!Array.isArray(parsed.presets) || parsed.presets.length === 0) {
    error(file, 'expected a non-empty "presets" array');
    continue;
  }

  const seenIds = new Set<string>();

  for (const preset of parsed.presets) {
    validatePreset(file, preset, style, descriptor, seenIds);
    presetCount++;
  }
}

for (const message of warnings) {
  console.warn(`warning  ${message}`);
}

for (const message of errors) {
  console.error(`error    ${message}`);
}

if (errors.length > 0) {
  console.error(
    `\n${errors.length} error(s) in ${files.length} preset file(s).`,
  );
  process.exit(1);
}

console.log(
  `${presetCount} presets in ${files.length} file(s) validated${
    warnings.length > 0 ? `, ${warnings.length} warning(s)` : ''
  }.`,
);
