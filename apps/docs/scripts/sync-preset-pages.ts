/**
 * Wires every style that has presets into the docs: a teaser section on its
 * style page and a gallery page under it. Idempotent, so it can run again
 * after presets are added for another style.
 *
 * Usage: node scripts/sync-preset-pages.ts [--check]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { capitalCase } from 'change-case';

const check = process.argv.includes('--check');

const presetsDir = fileURLToPath(
  new URL('../.vitepress/theme/presets', import.meta.url),
);
const pagesDir = fileURLToPath(new URL('../pages/styles', import.meta.url));

const IMPORT =
  'import StylePresets from "@theme/components/styles/StylePresets.vue";';

const SECTION = '## Presets';

function galleryPage(styleName: string) {
  const title = capitalCase(styleName);

  return `---
title: ${title} Presets – Avatar Style
description: >
  Ready-made option sets for the ${title} avatar style. Copy a preset into your
  code or open it in the DiceBear playground and keep tuning from there.
layout: page
sidebar: false
aside: false
---

<script setup lang="ts">
import SitePresetsPage from "@theme/components/site/SitePresetsPage.vue";
</script>

<SitePresetsPage styleName="${styleName}">

A preset is an ordinary set of render options. Pick one, read its code or open
it in the Playground and keep tuning. Options a preset leaves alone keep varying
with the seed, so each row lists how many distinct avatars it still gives you.

</SitePresetsPage>
`;
}

/**
 * Adds the import and the teaser section to a style page. The section goes
 * above `## Options`, which every style page has, so the reader meets the
 * ready-made looks before the full list of knobs.
 */
function withSection(source: string, styleName: string) {
  // A style page on the SiteStylePage component renders the presets section
  // itself, so there is nothing to wire into the Markdown.
  if (source.includes('<SiteStylePage')) {
    return source;
  }
  let next = source;

  if (!next.includes(IMPORT)) {
    const marker = 'import StyleOptions from';
    const at = next.indexOf(marker);

    if (at === -1) {
      throw new Error('no StyleOptions import to anchor to');
    }

    next = next.slice(0, at) + IMPORT + '\n' + next.slice(at);
  }

  if (!next.includes(SECTION)) {
    const marker = '## Options';
    const at = next.indexOf(marker);

    if (at === -1) {
      throw new Error('no "## Options" heading to anchor to');
    }

    next =
      next.slice(0, at) +
      `${SECTION}\n\n<StylePresets styleName="${styleName}" :limit="5" />\n\n` +
      next.slice(at);
  }

  return next;
}

const styles = readdirSync(presetsDir)
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.slice(0, -'.json'.length))
  .sort();

const stale = [];
let written = 0;

for (const styleName of styles) {
  const pagePath = path.join(pagesDir, styleName, 'index.md');
  const galleryPath = path.join(pagesDir, styleName, 'presets', 'index.md');

  let source;

  try {
    source = readFileSync(pagePath, 'utf8');
  } catch {
    stale.push(`${styleName}: no style page at ${pagePath}`);
    continue;
  }

  let next;

  // A style page without the two anchors cannot be wired up here and has to be
  // edited by hand. Collected like every other problem instead of thrown, so
  // one odd page still reports the rest of them.
  try {
    next = withSection(source, styleName);
  } catch (error) {
    stale.push(`${styleName}: ${(error as Error).message}`);
    continue;
  }

  // Prettier owns the formatting of both files once they exist, so the check
  // asks whether the mount is there rather than whether the bytes still match
  // the template. Only a missing gallery page is written; an existing one is
  // left alone, because it may carry hand-written prose by now.
  const mount = `<SitePresetsPage styleName="${styleName}">`;
  let gallery;

  try {
    gallery = readFileSync(galleryPath, 'utf8');
  } catch {
    gallery = undefined;
  }

  // Gallery pages from before the Site components mounted the old gallery
  // component. They carried no hand-written prose, so the template replaces
  // them once.
  const legacyMount = `<StylePresets styleName="${styleName}" large />`;

  if (gallery?.includes(legacyMount)) {
    gallery = undefined;
  }

  const galleryOk = gallery?.includes(mount) ?? false;

  // A gallery page that exists but no longer mounts the component was edited
  // by hand, and rewriting it from the template would throw that away. Report
  // it instead, in both modes.
  if (gallery !== undefined && !galleryOk) {
    stale.push(
      `${styleName}: gallery page at ${path.relative(process.cwd(), galleryPath)} does not mount ${mount}`,
    );
  }

  if (next === source && galleryOk) {
    continue;
  }

  if (check) {
    if (next !== source) {
      stale.push(`${styleName}: style page has no presets section`);
    }

    if (gallery === undefined) {
      stale.push(
        `${styleName}: no gallery page at ${path.relative(process.cwd(), galleryPath)}`,
      );
    }

    continue;
  }

  if (next !== source) {
    writeFileSync(pagePath, next);
  }

  if (gallery === undefined) {
    mkdirSync(path.dirname(galleryPath), { recursive: true });
    writeFileSync(galleryPath, galleryPage(styleName));
  }

  // A hand-edited gallery page that dropped the mount reaches this point with
  // both files already in place. It is reported above and must not be counted
  // as a page this run wrote.
  if (next !== source || gallery === undefined) {
    written++;
    console.log(`${styleName}: pages synced`);
  }
}

if (stale.length > 0) {
  for (const message of stale) {
    console.error(`error    ${message}`);
  }
  process.exit(1);
}

console.log(
  check
    ? `${styles.length} styles with presets, pages up to date.`
    : `${styles.length} styles with presets, ${written} page set(s) written.`,
);
