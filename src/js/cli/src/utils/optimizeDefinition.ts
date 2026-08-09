import { Style, Avatar } from '@dicebear/core';
import { parse, stringify, type INode } from 'svgson';
import { optimize, type PluginConfig } from 'svgo';
import { isDeepStrictEqual } from 'node:util';

import {
  collectUnits,
  walkElements,
  type Definition,
  type DefinitionElement,
} from './definition.js';
import { cleanupNumericValues } from './cleanupNumericValues.js';
import { definitionToSvgson } from './definitionToSvgson.js';
import { svgsonToDefinition } from './svgsonToDefinition.js';

/**
 * Seeds rendered before and after optimizing to check that the definition still
 * produces the same structure. Fixed rather than random so a failure is
 * reproducible.
 */
const RENDER_CHECK_SEEDS = [
  '',
  'a',
  'Aneka',
  'Felix',
  'Jocelyn',
  'Sawyer',
  'Zoe',
  '0',
  '12345',
  'ümläut',
];

/**
 * The svgo plugins applied to every element tree.
 *
 * This mirrors what the DiceBear Exporter for Figma already runs on export, so
 * a hand-authored definition ends up in the same shape as a generated one.
 * `cleanupNumericValues` is the exporter's custom variant, which keeps
 * normalized 0..1 attributes usable at low precision. Several plugins are
 * deliberately absent:
 *
 *  - `removeEmptyContainers` and `collapseGroups` would delete the childless
 *    marker groups the animation components are built on, and merge away the
 *    wrapper groups the animation CSS selects.
 *  - `cleanupIds` and `prefixIds` would rewrite `url(#color-…)`, whose targets
 *    only exist once the renderer has emitted the color definitions.
 *  - `minifyStyles`, `inlineStyles` and `convertStyleToAttrs` would rewrite the
 *    CSS in `<style>` elements.
 *  - `removeUnknownsAndDefaults` and `removeUselessStrokeAndFill` measured as no
 *    gain at all on the style library, so they are not worth their risk.
 */
function buildPlugins(precision: number): PluginConfig[] {
  return [
    { name: 'convertPathData', params: { floatPrecision: precision } },
    { name: 'convertTransform', params: { floatPrecision: precision } },
    cleanupNumericValues({ floatPrecision: precision }),
    'convertShapeToPath',
    'removeEmptyAttrs',
    'mergePaths',
  ];
}

/**
 * Structural fingerprint of a definition. Every part of it must survive
 * optimization untouched; anything else means svgo rewrote something it was not
 * supposed to.
 */
interface Fingerprint {
  ids: string[];
  classes: string[];
  components: string[];
  variables: string[];
  css: string[];
}

function fingerprint(definition: Definition): Fingerprint {
  const result: Fingerprint = {
    ids: [],
    classes: [],
    components: [],
    variables: [],
    css: [],
  };

  const collect = (elements: readonly DefinitionElement[]) => {
    walkElements(elements, (element) => {
      if (element.type === 'component') {
        result.components.push(element.name ?? '');
      }

      if (element.type === 'text' && typeof element.value === 'object') {
        result.variables.push(element.value.name);
      }

      for (const [key, value] of Object.entries(element.attributes ?? {})) {
        if (typeof value === 'object') {
          if (value.type === 'variable') {
            result.variables.push(value.name);
          }

          continue;
        }

        if (key === 'id') {
          result.ids.push(value);
        } else if (key === 'class') {
          result.classes.push(value);
        }
      }

      if (element.name === 'style') {
        for (const child of element.children ?? []) {
          if (typeof child.value === 'string') {
            result.css.push(child.value);
          }
        }
      }
    });
  };

  for (const unit of collectUnits(definition)) {
    collect(unit.owner.elements);
  }

  for (const key of Object.keys(result) as (keyof Fingerprint)[]) {
    result[key].sort();
  }

  return result;
}

/**
 * Copies an element tree without empty `attributes` / `children` members.
 *
 * A definition may legitimately store them empty, but the SVG round-trip
 * cannot represent the difference between empty and absent, so the identity
 * gate compares against this normalized form and only fails on real losses.
 */
function withoutEmptyMembers(
  elements: readonly DefinitionElement[],
): DefinitionElement[] {
  return elements.map((element) => {
    const result = { ...element };

    if (result.attributes && Object.keys(result.attributes).length === 0) {
      delete result.attributes;
    }

    if (result.children) {
      if (result.children.length === 0) {
        delete result.children;
      } else {
        result.children = withoutEmptyMembers(result.children);
      }
    }

    return result;
  });
}

/**
 * Swaps every `<style>` text for a comment placeholder and returns the
 * originals keyed by placeholder.
 *
 * svgo's stylesheet collector skips `@keyframes` only at the top level; the
 * keyframes the animation components wrap in `@media (prefers-reduced-motion)`
 * leak their `0%, …` steps into the rule list, where css-select then fails on
 * the `%` selector. The retained plugins never rewrite CSS, so the text is
 * hidden from svgo entirely and restored afterwards; if svgo dropped a style
 * element regardless, restoration misses it and the css fingerprint gate
 * fails the run.
 */
function shieldStyleTexts(
  elements: readonly DefinitionElement[],
): Map<string, string> {
  const shielded = new Map<string, string>();

  walkElements(elements, (element) => {
    if (element.name !== 'style') {
      return;
    }

    for (const child of element.children ?? []) {
      if (typeof child.value === 'string' && child.value !== '') {
        const token = `/*dicebear-css-${shielded.size}*/`;

        shielded.set(token, child.value);
        child.value = token;
      }
    }
  });

  return shielded;
}

/** Reverses {@link shieldStyleTexts} on an optimized tree. */
function restoreStyleTexts(
  elements: readonly DefinitionElement[],
  shielded: Map<string, string>,
): void {
  walkElements(elements, (element) => {
    if (element.name !== 'style') {
      return;
    }

    for (const child of element.children ?? []) {
      if (typeof child.value === 'string' && shielded.has(child.value)) {
        child.value = shielded.get(child.value) as string;
      }
    }
  });
}

/** Renders one avatar per seed and returns the SVG strings. */
function renderProbe(definition: Definition): string[] {
  const style = new Style(definition);

  return RENDER_CHECK_SEEDS.map((seed) =>
    new Avatar(style, { seed }).toString(),
  );
}

/** Every `id="…"`, `url(#…)` and `href="#…"` target in a rendered avatar. */
function referencedIds(svg: string): string[] {
  const found = [...svg.matchAll(/(?:id="|url\(#|href="#)([^"')]+)/g)].map(
    (match) => match[1],
  );

  return found.sort();
}

/**
 * Runs svgo over every element tree in a style definition.
 *
 * Definitions store SVG as a parsed tree with object-valued color, component
 * and variable references, none of which svgo understands. Each tree is
 * therefore converted to a real SVG document, optimized, and converted back.
 *
 * The conversion is verified rather than trusted. Before svgo runs, every tree
 * is passed through the conversion in both directions with no optimization in
 * between and compared to the input; afterwards the structural fingerprint is
 * compared, the result is re-validated against the schema, and a fixed set of
 * seeds is rendered on both sides. Anything unexpected throws.
 *
 * The input must already be schema-valid (the caller constructs a `Style`) and
 * is not modified. Returns a new definition object.
 */
export async function optimizeDefinition(
  input: Definition,
  precision: number,
): Promise<Definition> {
  const definition = structuredClone(input);
  const plugins = buildPlugins(precision);

  for (const unit of collectUnits(definition)) {
    const elements = unit.owner.elements;

    if (elements.length === 0) {
      continue;
    }

    const shieldedCss = shieldStyleTexts(elements);

    const document: INode = {
      name: 'svg',
      type: 'element',
      value: '',
      attributes: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${unit.width} ${unit.height}`,
      },
      children: elements.map(definitionToSvgson),
    };

    const svg = stringify(document);

    // Identity gate: the conversion has to be lossless on its own before it is
    // worth optimizing anything. A mismatch here means the tree uses something
    // the round-trip does not model, and guessing would corrupt the file.
    const identity = (await parse(svg)).children.map(svgsonToDefinition);

    if (!isDeepStrictEqual(identity, withoutEmptyMembers(elements))) {
      throw new Error(
        `Cannot optimize ${unit.label}: the SVG round-trip is not lossless for this tree.`,
      );
    }

    const optimized = optimize(svg, { multipass: true, plugins }).data;

    unit.owner.elements = (await parse(optimized)).children.map(
      svgsonToDefinition,
    );

    restoreStyleTexts(unit.owner.elements, shieldedCss);
  }

  // Identical trees cannot differ in fingerprint or rendered output, so the
  // verification below would only prove a tautology. This is the common case
  // when re-checking an already optimized definition.
  if (isDeepStrictEqual(definition, input)) {
    return definition;
  }

  const before = fingerprint(input);
  const after = fingerprint(definition);

  for (const key of Object.keys(before) as (keyof Fingerprint)[]) {
    if (!isDeepStrictEqual(before[key], after[key])) {
      throw new Error(
        `Optimization changed the ${key} of this definition, which must stay untouched.`,
      );
    }
  }

  // Throws a StyleValidationError if svgo produced anything the schema rejects,
  // which also covers the attribute allowlist and the value length limits.
  const probeBefore = renderProbe(input);
  const probeAfter = renderProbe(definition);

  for (let i = 0; i < RENDER_CHECK_SEEDS.length; i++) {
    if (
      !isDeepStrictEqual(
        referencedIds(probeBefore[i]),
        referencedIds(probeAfter[i]),
      )
    ) {
      throw new Error(
        `Optimization changed the id references rendered for seed "${RENDER_CHECK_SEEDS[i]}".`,
      );
    }
  }

  return definition;
}
