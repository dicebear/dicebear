/**
 * Writes the machine-readable half of the documentation into the build output:
 * an `llms.txt` index, an `llms-full.txt` with the complete prose, and a plain
 * Markdown mirror of every page next to its HTML.
 *
 * The reason for it is a mismatch that costs users real time. Language models
 * carry a lot of DiceBear knowledge from before v10 (`createAvatar()`,
 * `@dicebear/collection`, component options without the `Variant` suffix), and
 * the old HTTP API versions still answer, so the wrong answer looks right. A
 * model that can fetch the current docs cheaply, as text rather than as an
 * application shell, has something to correct itself against.
 *
 * Three things shape the implementation:
 *
 *  1. The source Markdown is written for VitePress, not for a reader. Roughly
 *     two thirds of the pages open with a `<script setup>` block, and the
 *     content carries containers, code annotations and Vue components. All of
 *     that is stripped or translated here, see {@link renderMarkdown}.
 *
 *  2. Style pages are almost entirely components. The interesting part, which
 *     options a style takes, only exists in its definition, so those pages are
 *     assembled from the definition instead of from the Markdown, see
 *     {@link renderStylePage}.
 *
 *  3. A page whose Markdown is only a component mount (the home page, the
 *     playground, the tools) has nothing to mirror. Those drop out on their
 *     own: a page needs {@link MIN_PROSE_LENGTH} characters of prose left
 *     after cleaning to get a mirror.
 */
import { Style, OptionsDescriptor } from '@dicebear/core';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { siteUrl } from './config/site.ts';
import avatarStyles, {
  definitionsDir,
  styleCount,
  animatedStyleCount,
  STYLE_COUNT_TOKEN,
  ANIMATED_STYLE_COUNT_TOKEN,
} from './config/avatarStyles.ts';
import { versions, libraryVersions } from './config/versions.ts';
import { softwareLicense } from './config/softwareLicense.ts';
import {
  categoryOrder,
  getStyleCategory,
  normalizeLicense,
  type LicenseBucket,
} from './theme/config/styleCategories.ts';
import { usageSnippets } from './theme/config/usageSnippets.ts';
import type { StylePreset } from './theme/config/presets.ts';
import { formatLicenseName } from './theme/utils/format.ts';
import { attributionKind, attributionPrefix } from './theme/utils/license.ts';
import { capitalCase } from 'change-case';

/**
 * How much prose a page needs for a Markdown mirror to be worth writing.
 * Enough to clear a heading plus a sentence, which every real page has and no
 * component-only page reaches.
 */
const MIN_PROSE_LENGTH = 200;

/** Seed used in the generated examples, matching the one the docs use. */
const EXAMPLE_SEED = 'John';

/**
 * Sections of the `llms.txt` index, in the order they appear. Every page that
 * gets a mirror is filed under the first section whose prefix matches its
 * route; `Other` catches the rest.
 */
const SECTIONS: readonly { title: string; prefixes: readonly string[] }[] = [
  { title: 'Getting started', prefixes: ['/introduction/'] },
  { title: 'Libraries and API', prefixes: ['/how-to-use/'] },
  { title: 'Guides', prefixes: ['/guides/'] },
  { title: 'Specification', prefixes: ['/specification/'] },
];

export interface LlmsPage {
  /** Site route with a trailing slash, e.g. `/how-to-use/http-api/`. */
  readonly route: string;
  /** Path of the source file relative to the pages directory. */
  readonly relativePath: string;
  readonly title: string;
  readonly description: string;
  /**
   * First paragraph of the page. Used for the style entries in `llms.txt`,
   * where the frontmatter description is written for search engines and says
   * the same thing about all {@link styleCount} styles.
   */
  readonly summary: string;
  /** Cleaned Markdown, including the `# Title` heading. */
  readonly markdown: string;
}

/** Fills the count tokens that frontmatter and prose cannot compute. */
function fillTokens(value: string): string {
  return value
    .replaceAll(STYLE_COUNT_TOKEN, String(styleCount))
    .replaceAll(ANIMATED_STYLE_COUNT_TOKEN, String(animatedStyleCount));
}

/** Splits a page into its frontmatter object and the Markdown below it. */
function splitFrontmatter(source: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return { data: {}, body: source };
  }

  return {
    data: (parseYaml(match[1]) as Record<string, unknown>) ?? {},
    body: source.slice(match[0].length),
  };
}

/**
 * Runs `transform` over the parts of a line that are not inside an inline code
 * span.
 *
 * Without this, tag removal eats type signatures: `Map<String, Object?>` and
 * `Promise<ArrayBuffer>` both read as an HTML tag with a capitalized name, and
 * both appear in the docs as inline code.
 */
function outsideInlineCode(
  line: string,
  transform: (text: string) => string,
): string {
  return line
    .split(/(`+[^`]*`+)/g)
    .map((part, index) => (index % 2 === 1 ? part : transform(part)))
    .join('');
}

/** Strips VitePress' code-block annotations, e.g. `// [!code focus:3]`. */
function stripCodeAnnotations(line: string): string {
  return line.replace(
    /[ \t]*(?:\/\/|#|<!--)[ \t]*\[!code[^\]]*\][ \t]*(?:-->)?/g,
    '',
  );
}

/**
 * The GitHub alert that matches each VitePress container type.
 *
 * `details` is deliberately absent. It renders as a disclosure widget rather
 * than an admonition, and it is how a page folds away material that would
 * distract a human reader. A model has no such problem, so the mirror keeps
 * that content inline and unquoted like any other container.
 */
const ALERTS: Record<string, string> = {
  tip: 'TIP',
  info: 'NOTE',
  warning: 'WARNING',
  danger: 'CAUTION',
};

/**
 * Turns a page body into plain Markdown.
 *
 * Runs as a single pass over the lines because every rule needs to know
 * whether it is inside a fenced code block: `:::` is a container outside one
 * and a literal inside one, and `<Style…>` is a component outside one and part
 * of an example inside one.
 */
function renderMarkdown(body: string): string {
  // The `<script setup>` and `<style>` blocks sit between the frontmatter and
  // the content, never inside a fence, so removing them upfront keeps the line
  // pass from having to model them.
  const source = body
    .replace(/<script[\s\S]*?<\/script>\s*/g, '')
    .replace(/<style[\s\S]*?<\/style>\s*/g, '');

  const out: string[] = [];
  /** The opening delimiter of the fence we are in, if any. */
  let fence: string | undefined;
  /**
   * The open alert container, if any. Its lines are collected instead of
   * emitted, because a GitHub alert only holds together when the whole block
   * is quoted and free of leading and trailing blank lines.
   */
  let alert: { marker: string; lines: string[] } | undefined;
  /** Depth of open containers that only wrap layout, e.g. `code-group`. */
  let plainContainers = 0;

  const emit = (line: string) => (alert ? alert.lines : out).push(line);

  const closeAlert = () => {
    if (!alert) {
      return;
    }

    const body = alert.lines.join('\n').replace(/^\n+|\n+$/g, '');

    out.push(
      '',
      ...[alert.marker, ...body.split('\n')].map((line) =>
        line ? `> ${line}` : '>',
      ),
      '',
    );

    alert = undefined;
  };

  for (const raw of source.split('\n')) {
    const line = raw.replace(/\r$/, '');
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

    if (fence !== undefined) {
      if (fenceMatch && fenceMatch[1].startsWith(fence)) {
        fence = undefined;
      }

      emit(stripCodeAnnotations(line));
      continue;
    }

    if (fenceMatch) {
      fence = fenceMatch[1];
      emit(line);
      continue;
    }

    if (/^:::+\s*$/.test(line)) {
      if (alert) {
        closeAlert();
      } else if (plainContainers > 0) {
        plainContainers--;
      }

      continue;
    }

    const containerOpen = line.match(/^:::+\s*([a-z-]+)\s*(.*)$/);

    if (containerOpen) {
      const [, type, title] = containerOpen;
      const marker = ALERTS[type];

      if (marker === undefined) {
        plainContainers++;

        // `code-group` and `raw` wrap content that stands on its own, but a
        // `details` block puts its heading in the container line, and that
        // heading is often the only thing naming what follows.
        if (title.trim()) {
          emit('');
          emit(`**${fillTokens(title.trim())}**`);
          emit('');
        }
      } else {
        closeAlert();
        alert = {
          marker: title.trim()
            ? `[!${marker}] ${fillTokens(title.trim())}`
            : `[!${marker}]`,
          lines: [],
        };
      }

      continue;
    }

    emit(
      outsideInlineCode(fillTokens(line), (text) =>
        text
          .replace(/<!--[\s\S]*?-->/g, '')
          // The example URLs are the point of this component, and they are the
          // only page content that lives in an attribute rather than in the
          // Markdown around it.
          .replace(
            /<BrowserPreview\b[^>]*\burl="([^"]+)"[^>]*\/?>/g,
            (_, url) => `- \`${url}\``,
          )
          // Any other Vue component. Paired ones lose their tags but keep the
          // text they wrap, which is the part worth reading.
          .replace(/<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g, '')
          // Site-internal links are relative in the source and would dangle in
          // a file that gets copied into a chat window.
          .replace(
            /\]\((\/[^)\s]*)\)/g,
            (_, target) => `](${siteUrl(target)})`,
          ),
      ),
    );
  }

  closeAlert();

  return out
    .join('\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Lines where cleaning left source constructs behind: a Vue interpolation, a
 * container marker, a script block, a component tag, an HTML comment.
 *
 * {@link renderMarkdown} covers every construct the pages use today. This
 * check exists for the page written next year with one it does not cover,
 * which would otherwise ship as literal source text in the mirrors. Fenced
 * code and inline code stay out of it, the same way the cleaner skips them.
 */
function findLeftovers(markdown: string): string[] {
  const rules: readonly [name: string, pattern: RegExp][] = [
    ['Vue interpolation', /\{\{/],
    ['container marker', /^\s*:::/],
    ['script or style block', /<\/?(?:script|style)\b/i],
    ['component tag', /<\/?[A-Z][A-Za-z0-9]*[\s/>]/],
    ['HTML comment', /<!--/],
  ];

  const leftovers: string[] = [];
  let fence: string | undefined;

  markdown.split('\n').forEach((line, index) => {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

    if (fence !== undefined) {
      if (fenceMatch && fenceMatch[1].startsWith(fence)) {
        fence = undefined;
      }

      return;
    }

    if (fenceMatch) {
      fence = fenceMatch[1];
      return;
    }

    // The even segments sit outside inline code, the same split that
    // outsideInlineCode uses.
    const outside = line
      .split(/(`+[^`]*`+)/g)
      .filter((_, segment) => segment % 2 === 0)
      .join('');

    for (const [name, pattern] of rules) {
      if (pattern.test(outside)) {
        leftovers.push(`line ${index + 1} (${name}): ${line.trim()}`);
      }
    }
  });

  return leftovers;
}

/**
 * One option of a style's descriptor. @dicebear/core exports the class but not
 * the shape of its result, so the type comes from the method, the same way
 * theme/composables/useStyleOptions.ts derives it.
 */
type FieldDescriptor = ReturnType<OptionsDescriptor['toJSON']>[string];

/** Renders one option of a style's descriptor as a table row. */
function describeField(name: string, field: FieldDescriptor): string {
  const cell = (value: string) => value.replace(/\|/g, '\\|');

  let type: string = field.type;
  let detail = '';

  switch (field.type) {
    case 'enum':
      detail = field.values.map((value) => `\`${value}\``).join(', ');

      if (field.open) {
        detail += ' (further values allowed)';
      }

      break;
    case 'number':
    case 'range':
      if (field.min !== undefined && field.max !== undefined) {
        detail = `${field.min} to ${field.max}`;
      }

      break;
    case 'color':
      detail = 'Hex color, `#` optional';
      break;
  }

  if ('list' in field && field.list) {
    type += ' (array allowed)';
  }

  return `| \`${name}\` | ${cell(type)} | ${cell(detail)} |`;
}

/** A fenced code block. */
function fence(lang: string, code: string): string {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/** Reads a packaged style definition and wraps it for introspection. */
async function loadStyle(name: string): Promise<Style> {
  return new Style(
    JSON.parse(
      await fs.readFile(path.join(definitionsDir, `${name}.min.json`), 'utf8'),
    ),
  );
}

const presetsDir = path.join(import.meta.dirname, 'theme', 'presets');

/**
 * The gallery presets of a style. Read from disk rather than through
 * theme/config/presets.ts, which discovers its files with `import.meta.glob`
 * and therefore only works inside the Vite pipeline. Most styles have none
 * yet, so a missing file is a normal result.
 *
 * Only a missing file is. A malformed one throws, because swallowing it would
 * ship every mirror with the preset sections silently empty, which is exactly
 * what scripts/validate-presets.ts exists to prevent on the other reader.
 *
 * Deliberately uncached. Two pages read each file, and holding the parsed
 * result would leave the dev server serving the presets from whenever the
 * process started, which is the staleness `render` below re-reads to avoid.
 */
function loadPresets(name: string): Promise<StylePreset[]> {
  return fs
    .readFile(path.join(presetsDir, `${name}.json`), 'utf8')
    .then((raw): StylePreset[] => {
      const presets = JSON.parse(raw).presets;

      // A file whose top level is not `{ "presets": [...] }` parses fine and
      // would otherwise pass as a style with no presets, which reads the same
      // as a style that has none yet.
      if (!Array.isArray(presets)) {
        throw new Error(`${name}.json has no "presets" array.`);
      }

      return presets;
    })
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') {
        return [];
      }

      throw error;
    });
}

/**
 * One option per line, but each value compact. A preset sets a dozen color
 * groups, and JSON.stringify's indentation would put every single hex on a
 * line of its own.
 */
function formatPresetOptions(options: Record<string, unknown>): string {
  return `{\n${Object.entries(options)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`)
    .join(',\n')}\n}`;
}

/**
 * Every preset with its full option set, for the gallery mirror. Presets carry
 * no API of their own, only ordinary render options, so this prints the set
 * verbatim and leaves the calling convention to the style page.
 *
 * The headings are `##` because the gallery page title is already an `h1`.
 */
function renderPresetBlocks(presets: readonly StylePreset[]): string {
  if (presets.length === 0) {
    return '';
  }

  const blocks = presets.map((preset) =>
    [
      `## ${preset.name}`,
      preset.description,
      fence('json', formatPresetOptions(preset.options)),
    ].join('\n\n'),
  );

  return `\n\n${blocks.join('\n\n')}`;
}

/**
 * The `## Presets` section of a style page: what presets are, one line each,
 * and where to get the option sets.
 *
 * The sets themselves stay on the gallery mirror. Printing them on both put the
 * same text into llms-full.txt twice, roughly 177 KB of a one-megabyte file
 * whose whole point is to spare a model the wading.
 */
function renderPresetSummary(
  name: string,
  presets: readonly StylePreset[],
): string {
  if (presets.length === 0) {
    return '';
  }

  const galleryUrl = `${siteUrl(`/styles/${name}/presets/`)}index.md`;

  return `

## Presets

${presets.length} ready-made option sets for this style. Each is a plain set of
render options: pass it to any of the libraries or send it as HTTP-API query
parameters. You do not need to install anything for them, and any option a
preset leaves out keeps varying with the seed.

${presets.map((preset) => `- **${preset.name}:** ${preset.summary}`).join('\n')}

The full option set of each one is at ${galleryUrl}.`;
}

/**
 * Builds a style page from its definition.
 *
 * `intro` is the hand-written prose above the first component of the source
 * page, and the only part of a style page that is not generated. The
 * attribution, the usage snippets and the option table below it are derived,
 * because the page itself only mounts components that read the definition at
 * runtime.
 */
async function renderStylePage(name: string, intro: string): Promise<string> {
  const meta = avatarStyles[name];
  const descriptor = new OptionsDescriptor(await loadStyle(name)).toJSON();
  const presets = await loadPresets(name);
  const license = formatLicenseName(meta.meta?.license?.name);

  const facts = [
    `- **Style name:** \`${name}\``,
    `- **Category:** ${getStyleCategory(name)}`,
    `- **Animated:** ${meta.animated ? 'yes' : 'no'}`,
    `- **Creator:** ${meta.meta?.creator}${meta.meta?.homepage ? ` (${meta.meta.homepage})` : ''}`,
    meta.meta?.source ? `- **Source:** ${meta.meta.source}` : undefined,
    `- **License:** ${license}${meta.meta?.license?.url ? ` (${meta.meta.license.url})` : ''}`,
  ].filter((line) => line !== undefined);

  const options = Object.entries(descriptor)
    .map(([option, field]) => describeField(option, field))
    .join('\n');

  return `${intro}

${facts.join('\n')}

## Usage

Every library below produces the same SVG for the same seed and options.

${usageSnippets(name, { major: versions.major, seed: EXAMPLE_SEED })
  .map((snippet) =>
    [
      `${snippet.label}:`,
      snippet.install === undefined ? undefined : fence('', snippet.install),
      fence(snippet.lang ?? '', snippet.code),
    ]
      .filter((block) => block !== undefined)
      .join('\n\n'),
  )
  .join('\n\n')}${renderPresetSummary(name, presets)}

## Options

Every option below works in all libraries and as a query parameter of the HTTP
API. The ones built from a component name (\`<component>Variant\`,
\`<component>Probability\`) or from a color group (\`<group>Color\`,
\`<group>ColorFill\`, \`<group>ColorFillStops\`, \`<group>ColorAngle\`,
\`<group>ColorOrder\`) belong to this style; the rest are
[core options](${siteUrl('/guides/core-options/')}) that every style accepts.

| Option | Type | Values |
| --- | --- | --- |
${options}

The same table is available as JSON at
\`https://api.dicebear.com/${versions.httpApi}/${name}/options.json\`, and the
raw definition at
\`https://api.dicebear.com/${versions.httpApi}/${name}/definition.json\`.`;
}

/**
 * Builds the licenses page from the style metadata and the repository
 * LICENSE. Like the style pages, the source page is almost entirely a
 * component mount, so its mirror is assembled from the same data the page
 * reads: the buckets come from normalizeLicense and the remix/port wording
 * from attributionPrefix, which the page and the OG cards also use.
 */
function renderLicensesPage(intro: string): string {
  const rows: Record<LicenseBucket, string[]> = {
    'CC BY 4.0': [],
    'CC0 1.0': [],
    MIT: [],
    Other: [],
  };
  let mitNotice: string | undefined;

  for (const [name, style] of Object.entries(avatarStyles)) {
    const meta = style.meta;
    const licenseName = formatLicenseName(meta?.license?.name);
    const bucket = normalizeLicense(licenseName);
    const kind = attributionKind(meta);

    let credit =
      kind === 'own-work'
        ? 'By DiceBear'
        : `${attributionPrefix(kind)} ${meta?.title ?? 'the original work'}${
            meta?.source ? ` (${meta.source})` : ''
          } by ${meta?.creator}${meta?.homepage ? ` (${meta.homepage})` : ''}`;

    if (bucket === 'Other') {
      credit += `, licensed under ${licenseName}${
        meta?.license?.url ? ` (${meta.license.url})` : ''
      }`;
    }

    if (bucket === 'MIT') {
      mitNotice ??= meta?.license?.text;
    }

    rows[bucket].push(
      `- ${capitalCase(name)} (${siteUrl(`/styles/${name}/`)}): ${credit}`,
    );
  }

  const sections: string[] = [];

  if (rows['CC0 1.0'].length > 0) {
    sections.push(`## CC0 1.0

These styles use the CC0 1.0 Public Domain Dedication, a waiver rather than a
license: https://creativecommons.org/publicdomain/zero/1.0/

${rows['CC0 1.0'].join('\n')}`);
  }

  if (rows['CC BY 4.0'].length > 0) {
    sections.push(`## CC BY 4.0

These styles are remixes of works licensed under CC BY 4.0, which requires
naming the original artist, linking the license, and mentioning that the work
was modified: https://creativecommons.org/licenses/by/4.0/

${rows['CC BY 4.0'].join('\n')}`);
  }

  if (rows.MIT.length > 0) {
    sections.push(`## MIT

The MIT license has a single condition: the copyright and permission notice
stays with the work.

${rows.MIT.join('\n')}${
      mitNotice === undefined
        ? ''
        : `\n\nThe notice:\n\n${fence('', mitNotice)}`
    }`);
  }

  if (rows.Other.length > 0) {
    sections.push(`## Artist's own terms

The artists of these styles wrote their own terms instead of picking a
standard license. They describe their work as free for personal and
commercial use.

${rows.Other.join('\n')}`);
  }

  sections.push(`## Software

The source code in the dicebear/dicebear repository is available under the
MIT license. That covers the libraries, the HTTP API, and this website. The
LICENSE file: https://github.com/dicebear/dicebear/blob/${versions.major}.x/LICENSE

${fence('', softwareLicense)}`);

  return `${intro}

${sections.join('\n\n')}

The summaries on this page are meant as orientation, not as legal advice. The
linked license texts are the authoritative source.`;
}

/** The route a source file is served under, e.g. `/how-to-use/cli/`. */
function routeFor(relativePath: string): string {
  const withoutExtension = relativePath
    .replace(/\\/g, '/')
    .replace(/index\.md$/, '')
    .replace(/\.md$/, '/');

  return `/${withoutExtension}`;
}

/** Every Markdown file below `dir`, relative to it and sorted by path. */
async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) =>
      path
        .relative(dir, path.join(entry.parentPath, entry.name))
        .replace(/\\/g, '/'),
    )
    .sort();
}

/** Reads one source page and turns it into its mirror, if it has prose. */
async function buildPage(
  srcDir: string,
  relativePath: string,
): Promise<LlmsPage | undefined> {
  const route = routeFor(relativePath);

  // The site notice is excluded from search engines in transformHead; there is
  // no reason to hand it to a crawler in a friendlier format instead.
  if (route.startsWith('/legal/')) {
    return undefined;
  }

  const source = await fs.readFile(path.join(srcDir, relativePath), 'utf8');
  const { data, body } = splitFrontmatter(source);

  const styleName = route.match(/^\/styles\/([^/]+)\/$/)?.[1];
  const presetsOf = route.match(/^\/styles\/([^/]+)\/presets\/$/)?.[1];

  let markdown: string;

  if (styleName && avatarStyles[styleName]) {
    // Everything from the first component onwards is a mount point whose
    // content this build reproduces from the definition.
    markdown = await renderStylePage(
      styleName,
      renderMarkdown(body.split(/^<[A-Z]/m)[0]),
    );
  } else if (presetsOf && avatarStyles[presetsOf]) {
    // Same deal one level down: the page is an intro plus a gallery mount, so
    // the presets themselves come from the data the gallery reads.
    markdown =
      renderMarkdown(body.split(/^<[A-Z]/m)[0]).trimEnd() +
      renderPresetBlocks(await loadPresets(presetsOf));
  } else if (route === '/licenses/') {
    markdown = renderLicensesPage(renderMarkdown(body.split(/^<[A-Z]/m)[0]));
  } else {
    markdown = renderMarkdown(body);
  }

  if (markdown.replace(/^#.*$/gm, '').trim().length < MIN_PROSE_LENGTH) {
    return undefined;
  }

  const title =
    typeof data.title === 'string'
      ? fillTokens(data.title)
      : (markdown.match(/^#\s+(.+)$/m)?.[1] ?? 'DiceBear');

  const description =
    typeof data.description === 'string'
      ? fillTokens(data.description).replace(/\s+/g, ' ').trim()
      : '';

  const summary =
    markdown
      .replace(/^#.*$/gm, '')
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block.length > 0 && !/^[-*>|`]/.test(block))
      ?.replace(/\s+/g, ' ') ?? '';

  return { route, relativePath, title, description, summary, markdown };
}

/** The mirror, with a header that names the page and where it came from. */
function withHeader(page: LlmsPage): string {
  const header = [
    `<!-- Source: ${siteUrl(page.route)} -->`,
    `<!-- Documentation for DiceBear ${versions.core}. The complete docs as one file: ${siteUrl('/llms-full.txt')} -->`,
  ].join('\n');

  return `${header}\n\n${page.markdown}\n`;
}

/**
 * A one-line summary of the project, repeated at the top of `llms.txt` and
 * `llms-full.txt` so a model that only reads the first lines still gets the
 * version it should be writing code against.
 */
function preamble(): string {
  return `> DiceBear is a free, open source avatar library and avatar API with ${styleCount} avatar styles, ${animatedStyleCount} of them animated. Avatars are generated deterministically from a seed: the same seed always produces the same SVG.

Current release: **${versions.core}**. The HTTP API serves it under \`https://api.dicebear.com/${versions.httpApi}/\`.

DiceBear is not a JavaScript library with wrappers around it. There are seven
native cores, and they are held to byte-identical output: the same style, seed
and options produce the same SVG in all of them. Only the syntax for passing
the options differs. Six of the seven are recent, so a model that has not read
this file is likely to claim they do not exist: PHP shipped in 10.0.0, Python
in 10.1.0, Rust and Go in 10.2.0, Dart in 10.3.0, C# in 10.7.0.

${libraryVersions
  .map(
    (library) =>
      `- ${library.label}: \`${library.pkg}\`${library.stylesPkg ? ` + \`${library.stylesPkg}\`` : ''} (${library.version}), ${siteUrl(library.docs)}`,
  )
  .join('\n')}

Older API versions (\`5.x\` through \`9.x\`) are still served for backwards
compatibility, so a URL built from them keeps working and an outdated answer
looks correct. Write \`${versions.httpApi}\` for new code.

The pre-v10 JavaScript API no longer exists: \`createAvatar()\`,
\`@dicebear/collection\` and individual style packages such as
\`@dicebear/lorelei\` were all removed in 10.0.0. The other six cores have no
pre-v10 form at all, so any older-looking API attributed to them is invented.
In every core, an option named after a component ends in \`Variant\`
(\`eyesVariant\`, not \`eyes\`). The outdated patterns are listed at
${siteUrl('/guides/dicebear-for-ai-assistants/')}.`;
}

/** The `llms.txt` index: the preamble plus a link list, grouped by section. */
function renderIndex(pages: readonly LlmsPage[]): string {
  const link = (page: LlmsPage) =>
    `- [${page.title}](${siteUrl(page.route)}index.md)${page.description ? `: ${page.description}` : ''}`;

  const sections = SECTIONS.map((section) => {
    const items = pages.filter((page) =>
      section.prefixes.some((prefix) => page.route.startsWith(prefix)),
    );

    return items.length > 0
      ? `## ${section.title}\n\n${items.map(link).join('\n')}`
      : undefined;
  }).filter((section) => section !== undefined);

  // Two lookups per style below, over every page in the site. Indexed once
  // instead.
  const byRoute = new Map(pages.map((page) => [page.route, page]));

  const styleSections = categoryOrder
    .map((category) => {
      const items = Object.keys(avatarStyles)
        .filter((name) => getStyleCategory(name) === category)
        .sort()
        .map((name) => {
          const page = byRoute.get(`/styles/${name}/`);

          if (!page) {
            return undefined;
          }

          const traits = [
            avatarStyles[name].animated ? 'animated' : undefined,
            formatLicenseName(avatarStyles[name].meta?.license?.name),
          ].filter(Boolean);

          // The gallery mirror sits under the style's own route, which neither
          // this list nor `rest` below would otherwise reach, so it is named
          // here rather than left served but unlisted.
          const gallery = byRoute.has(`/styles/${name}/presets/`)
            ? ` [Presets](${siteUrl(`/styles/${name}/presets/`)}index.md).`
            : '';

          return `- [${name}](${siteUrl(page.route)}index.md) (${traits.join(', ')}): ${page.summary || page.description}${gallery}`;
        })
        .filter((item) => item !== undefined);

      return items.length > 0
        ? `### ${category}\n\n${items.join('\n')}`
        : undefined;
    })
    .filter((section) => section !== undefined);

  const rest = pages.filter(
    (page) =>
      !page.route.startsWith('/styles/') &&
      !SECTIONS.some((section) =>
        section.prefixes.some((prefix) => page.route.startsWith(prefix)),
      ),
  );

  return `# DiceBear

${preamble()}

${sections.join('\n\n')}

## Avatar styles

Every style below is available in all libraries and under
\`https://api.dicebear.com/${versions.httpApi}/<style>/svg\`.

${styleSections.join('\n\n')}

## Optional

${rest.map(link).join('\n')}
- [Everything above in one file](${siteUrl('/llms-full.txt')}): every page concatenated, guides first, then the style pages with their full option tables
- [Changelog](https://github.com/dicebear/dicebear/blob/${versions.major}.x/CHANGELOG.md): every release since 10.0.0
`;
}

/**
 * Every page in one file, prose first and the avatar styles behind it.
 *
 * The order is the point. Roughly half the bytes here are the option tables of
 * the {@link styleCount} styles, and a model that fetched this file to find out
 * how to call DiceBear in Go should not have to read through them first. It
 * gets the guides, then the compact style list, then the style pages
 * themselves, so it can stop at whichever of the three answered its question.
 */
function renderFull(pages: readonly LlmsPage[]): string {
  // Sorted into the reading order of llms.txt rather than by file path, so the
  // introduction comes before the guides instead of after them.
  const sectionRank = (page: LlmsPage) => {
    const index = SECTIONS.findIndex((section) =>
      section.prefixes.some((prefix) => page.route.startsWith(prefix)),
    );

    return index === -1 ? SECTIONS.length : index;
  };

  const section = (page: LlmsPage) =>
    `---\n\nSource: ${siteUrl(page.route)}\n\n${page.markdown}`;

  const isStyle = (page: LlmsPage) => page.route.startsWith('/styles/');

  const documents = pages
    .filter((page) => !isStyle(page))
    .sort(
      (a, b) =>
        sectionRank(a) - sectionRank(b) || a.route.localeCompare(b.route),
    );

  const stylePages = pages
    .filter(isStyle)
    .sort((a, b) => a.route.localeCompare(b.route));

  const styleIndex = Object.keys(avatarStyles)
    .sort()
    .map(
      (name) =>
        `- \`${name}\` (${getStyleCategory(name)}${avatarStyles[name].animated ? ', animated' : ''}), ${formatLicenseName(avatarStyles[name].meta?.license?.name)}: ${siteUrl(`/styles/${name}/`)}index.md`,
    )
    .join('\n');

  return `# DiceBear documentation

${preamble()}

This file holds every documentation page. The prose comes first, then a compact
list of the ${styleCount} avatar styles, then one section per style with its
license, its loading snippet in all seven languages, and its full option table.

${documents.map(section).join('\n\n')}

---

# Avatar styles

${styleIndex}

${stylePages.map(section).join('\n\n')}
`;
}

export interface LlmsBundle {
  /** Routes that have a Markdown mirror, for the Markdown link in the theme. */
  readonly routes: readonly string[];
  /** Contents of `llms.txt`. */
  readonly index: string;
  /** Contents of `llms-full.txt`. */
  readonly full: string;
  /** Renders a single mirror on demand, used by the dev server. */
  render(route: string): Promise<string | undefined>;
  /** Writes every generated file into the build output. */
  write(outDir: string): Promise<void>;
}

/**
 * Reads the pages once and returns everything the build and the dev server
 * need. Called while the config is being built, because `themeConfig` has to
 * know the routes before the first page renders.
 */
export async function prepareLlms(srcDir: string): Promise<LlmsBundle> {
  const files = await collectMarkdownFiles(srcDir);
  const pages = (
    await Promise.all(files.map((file) => buildPage(srcDir, file)))
  ).filter((page) => page !== undefined);

  const problems = pages.flatMap((page) =>
    findLeftovers(page.markdown).map((hit) => `  ${page.route} ${hit}`),
  );

  if (problems.length > 0) {
    throw new Error(
      `Source constructs the mirror build does not handle would ship as ` +
        `literal text, see renderMarkdown in llms.ts:\n${problems.join('\n')}`,
    );
  }

  const byRoute = new Map(pages.map((page) => [page.route, page]));
  const index = renderIndex(pages);
  const full = renderFull(pages);

  return {
    routes: pages.map((page) => page.route),
    index,
    full,

    async render(route) {
      // Re-read rather than serve the snapshot: in the dev server this runs
      // after the author has edited the file.
      const page = byRoute.get(route);

      if (!page) {
        return undefined;
      }

      const fresh = await buildPage(srcDir, page.relativePath);

      return fresh ? withHeader(fresh) : undefined;
    },

    async write(outDir) {
      await Promise.all(
        pages.map(async (page) => {
          const contents = withHeader(page);
          const target = path.join(outDir, page.route, 'index.md');

          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, contents);

          // Agents commonly try the page URL with `.md` appended. The routes
          // end in a slash, so that spelling is a sibling file rather than
          // this one, and it is small enough to just write twice.
          if (page.route !== '/') {
            await fs.writeFile(
              path.join(outDir, `${page.route.replace(/\/$/, '')}.md`),
              contents,
            );
          }
        }),
      );

      await fs.writeFile(path.join(outDir, 'llms.txt'), index);
      await fs.writeFile(path.join(outDir, 'llms-full.txt'), full);

      console.log(
        `[llms] wrote llms.txt, llms-full.txt and ${pages.length} page mirrors`,
      );
    },
  };
}
