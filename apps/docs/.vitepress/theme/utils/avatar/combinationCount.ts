import type { StyleDefinition } from '@dicebear/core';
import type { AvatarUniqueCount } from '@theme/types';

// Locally-mirrored granular pieces of @dicebear/core's `StyleDefinition` —
// the core only re-exports the root type, but we need to address the nested
// pieces directly.
type Components = NonNullable<StyleDefinition['components']>;
export type Component = Components[string];
export type ComponentBase = Extract<Component, { variants: unknown }>;
export type ComponentAlias = Extract<Component, { extends: string }>;
export type Variant = ComponentBase['variants'][string];
type Range = NonNullable<ComponentBase['rotate']>;
export type ColorGroup = NonNullable<StyleDefinition['colors']>[string];

export function isAlias(
  component: Component | undefined,
): component is ComponentAlias {
  return (
    component !== undefined &&
    'extends' in component &&
    typeof component.extends === 'string'
  );
}

function isComponentRef(
  node: unknown,
): node is { type: 'component'; name: string } {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: unknown }).type === 'component' &&
    typeof (node as { name?: unknown }).name === 'string'
  );
}

function isVariableRef(
  node: unknown,
): node is { type: 'variable'; name: string } {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: unknown }).type === 'variable' &&
    typeof (node as { name?: unknown }).name === 'string'
  );
}

function walkElements(node: unknown, visit: (node: object) => void): void {
  if (node === null || typeof node !== 'object') {
    return;
  }

  visit(node);

  if (Array.isArray(node)) {
    for (const item of node) {
      walkElements(item, visit);
    }

    return;
  }

  for (const value of Object.values(node as Record<string, unknown>)) {
    walkElements(value, visit);
  }
}

function collectComponentRefs(node: unknown): Set<string> {
  const out = new Set<string>();

  walkElements(node, (n) => {
    if (isComponentRef(n)) {
      out.add(n.name);
    }
  });

  return out;
}

function isColorRef(node: unknown): node is { type: 'color'; name: string } {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: unknown }).type === 'color' &&
    typeof (node as { name?: unknown }).name === 'string'
  );
}

function collectColorRefs(node: unknown): Set<string> {
  const out = new Set<string>();

  walkElements(node, (n) => {
    if (isColorRef(n)) {
      out.add(n.name);
    }
  });

  return out;
}

type InitialsUsage = { initial: boolean; initials: boolean };

function collectInitialsUsage(node: unknown, usage: InitialsUsage): void {
  walkElements(node, (n) => {
    if (!isVariableRef(n)) {
      return;
    }

    if (n.name === 'initial') {
      usage.initial = true;
    } else if (n.name === 'initials') {
      usage.initials = true;
    }
  });
}

export function resolveBase(
  definition: StyleDefinition,
  componentName: string,
): { name: string; component: ComponentBase } | undefined {
  const seen = new Set<string>();
  let current = componentName;

  while (!seen.has(current)) {
    seen.add(current);

    const component = definition.components?.[current];

    if (component === undefined) {
      return undefined;
    }

    if (isAlias(component)) {
      current = component.extends;

      continue;
    }

    return { name: current, component };
  }

  return undefined;
}

// Mirrors Prng.weightedPick fallback (src/js/core/src/Prng.ts:56-60):
// when every variant has weight 0 the renderer falls back to an unweighted
// pick across all variants, so weight-0 variants only become unreachable
// when at least one positively-weighted sibling exists.
function effectiveVariants(base: ComponentBase): Variant[] {
  const variants = Object.values(base.variants ?? {});
  const allZero =
    variants.length > 0 && variants.every((v) => (v.weight ?? 1) === 0);

  return allZero ? variants : variants.filter((v) => (v.weight ?? 1) > 0);
}

// Perceptual grain for continuous transform ranges. Prng.float rounds to
// four decimals (src/js/core/src/Prng.ts:89-98), but nobody can tell a
// rotation of 12.3456° from 12.3457°, so counting at that resolution would
// inflate the number by orders of magnitude. Continuous ranges are counted
// in whole degrees, whole percent of the component's size, and hundredths
// of the scale factor instead. A definition's own `step` wins when it is
// coarser. Keep in sync with the "Per-component transforms" paragraph on
// pages/understand/how-many-unique-avatars/index.md.
const TRANSFORM_GRAIN = {
  rotate: 1,
  scale: 0.01,
  translate: 1,
} as const;

// Guards against floating point noise in the division below, so a range
// whose width is an exact multiple of the grain still counts both ends.
const GRAIN_EPSILON = 1e-9;

// Counts the visibly distinct outputs of one transform range: a range
// yields floor((max - min) / grain) + 1 buckets, where grain is the larger
// of the definition's `step` and the perceptual grain; `min === max`
// yields 1.
function rangeSlots(range: Range | undefined, grain: number): bigint {
  if (!range) {
    return 1n;
  }

  const min = Math.min(range.min, range.max);
  const max = Math.max(range.min, range.max);

  if (min === max) {
    return 1n;
  }

  const step = Math.max(range.step ?? 0, grain);

  return BigInt(Math.floor((max - min) / step + GRAIN_EPSILON) + 1);
}

function transformMultiplier(base: ComponentBase): bigint {
  return (
    rangeSlots(base.rotate, TRANSFORM_GRAIN.rotate) *
    rangeSlots(base.scale, TRANSFORM_GRAIN.scale) *
    rangeSlots(base.translate?.x, TRANSFORM_GRAIN.translate) *
    rangeSlots(base.translate?.y, TRANSFORM_GRAIN.translate)
  );
}

// A bitmask over the definition's color groups, one bit per group in
// declaration order. Bigint so that the count never depends on how many
// groups a style declares.
type GroupMask = bigint;

// Distinct renderings keyed by the set of color groups they actually
// reference. Splitting the count by mask lets the color palettes be counted
// only where a color is visible: a hat color on an avatar without a hat
// changes nothing on screen.
type Outcomes = Map<GroupMask, bigint>;

function addOutcome(target: Outcomes, mask: GroupMask, count: bigint): void {
  target.set(mask, (target.get(mask) ?? 0n) + count);
}

function mergeOutcomes(target: Outcomes, source: Outcomes): void {
  for (const [mask, count] of source) {
    addOutcome(target, mask, count);
  }
}

// Cartesian product of two outcome tables: masks union, counts multiply.
function productOutcomes(a: Outcomes, b: Outcomes): Outcomes {
  const out: Outcomes = new Map();

  for (const [maskA, countA] of a) {
    for (const [maskB, countB] of b) {
      addOutcome(out, maskA | maskB, countA * countB);
    }
  }

  return out;
}

function scaleOutcomes(source: Outcomes, factor: bigint): Outcomes {
  if (factor === 1n) {
    return source;
  }

  const out: Outcomes = new Map();

  for (const [mask, count] of source) {
    out.set(mask, count * factor);
  }

  return out;
}

const NOT_RENDERED: Outcomes = new Map([[0n, 1n]]);

class GroupIndex {
  readonly #bits = new Map<string, GroupMask>();

  // The renderer paints a `background` group behind every avatar without
  // any element referencing it (Renderer.ts, `#renderBackground`), so it
  // counts as visible whenever the definition declares it.
  readonly always: GroupMask;

  constructor(definition: StyleDefinition) {
    Object.keys(definition.colors ?? {}).forEach((name, i) => {
      this.#bits.set(name, 1n << BigInt(i));
    });

    this.always = this.#bits.get('background') ?? 0n;
  }

  maskOf(node: unknown): GroupMask {
    let mask = this.always;

    for (const name of collectColorRefs(node)) {
      mask |= this.#bits.get(name) ?? 0n;
    }

    return mask;
  }

  has(name: string, mask: GroupMask): boolean {
    const bit = this.#bits.get(name);

    return bit !== undefined && (mask & bit) !== 0n;
  }
}

/**
 * Computes the distinct renderings produced when a `<use>` of `name` is
 * rendered, grouped by the color groups those renderings reference.
 * Mirrors {@link Resolver.variant}, {@link Resolver.componentTransform},
 * and the probability short-circuit in `Resolver.#isVisible`.
 *
 * Exact for tree-shaped reachability (one parent per component). The two
 * shipped definitions with shared descendants (lorelei: `mouth` reachable
 * through `head` and `beard`; micah: `mouth` reachable through canvas and
 * `facialHair`) are overcounted by a factor of `outcomes(shared)` per
 * extra parent. Acceptable trade-off — the alternative is a full
 * variant-tuple enumeration that scales as 7^49 for circles.
 */
function outcomes(
  definition: StyleDefinition,
  groups: GroupIndex,
  name: string,
  visited: Set<string>,
): Outcomes {
  if (visited.has(name)) {
    return NOT_RENDERED;
  }

  const base = resolveBase(definition, name);

  if (!base) {
    return NOT_RENDERED;
  }

  visited.add(name);

  const variantSum: Outcomes = new Map();

  for (const variant of effectiveVariants(base.component)) {
    let product: Outcomes = new Map([[groups.maskOf(variant.elements), 1n]]);

    for (const ref of collectComponentRefs(variant.elements)) {
      product = productOutcomes(
        product,
        outcomes(definition, groups, ref, visited),
      );
    }

    mergeOutcomes(variantSum, product);
  }

  visited.delete(name);

  const rendered = scaleOutcomes(
    variantSum,
    transformMultiplier(base.component),
  );
  const p = base.component.probability ?? 100;

  if (p <= 0) {
    return NOT_RENDERED;
  }

  if (p >= 100) {
    return rendered;
  }

  const withAbsent = new Map(rendered);

  mergeOutcomes(withAbsent, NOT_RENDERED);

  return withAbsent;
}

function componentOutcomes(
  definition: StyleDefinition,
  groups: GroupIndex,
): Outcomes {
  const elements = definition.canvas?.elements;
  let total: Outcomes = new Map([[groups.maskOf(elements), 1n]]);

  for (const ref of collectComponentRefs(elements)) {
    total = productOutcomes(
      total,
      outcomes(definition, groups, ref, new Set()),
    );
  }

  return total;
}

function normalizeHex(input: string): string {
  let raw = input.trim();

  if (raw.startsWith('#')) {
    raw = raw.slice(1);
  }

  if (raw.length === 3) {
    raw = raw
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (raw.length === 8) {
    raw = raw.slice(0, 6);
  }

  return '#' + raw.toLowerCase();
}

function linearizeChannel(channel: number): number {
  const s = channel / 255;

  if (s <= 0.04045) {
    return s / 12.92;
  }

  return ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;

  return (
    0.2126 * linearizeChannel(r) +
    0.7152 * linearizeChannel(g) +
    0.0722 * linearizeChannel(b)
  );
}

function sortByContrast(candidates: readonly string[], ref: string): string[] {
  const refLum = luminance(ref);

  return Array.from(candidates)
    .map((c) => {
      const lum = luminance(c);
      const ratio =
        (Math.max(lum, refLum) + 0.05) / (Math.min(lum, refLum) + 0.05);

      return { color: c, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio)
    .map((e) => e.color);
}

function topoSortColorGroups(
  groups: Record<string, ColorGroup>,
): string[] | undefined {
  const names = Object.keys(groups);
  const incoming = new Map<string, Set<string>>();

  for (const name of names) {
    incoming.set(name, new Set());
  }

  for (const [name, group] of Object.entries(groups)) {
    const deps = new Set<string>();

    for (const ref of group.notEqualTo ?? []) {
      if (groups[ref]) {
        deps.add(ref);
      }
    }

    if (group.contrastTo && groups[group.contrastTo]) {
      deps.add(group.contrastTo);
    }

    incoming.set(name, deps);
  }

  const order: string[] = [];
  const ready = names.filter((n) => incoming.get(n)!.size === 0);

  while (ready.length > 0) {
    const name = ready.shift()!;

    order.push(name);

    for (const other of names) {
      const deps = incoming.get(other)!;

      if (deps.delete(name) && deps.size === 0 && !order.includes(other)) {
        ready.push(other);
      }
    }
  }

  if (order.length !== names.length) {
    return undefined;
  }

  return order;
}

function jointColorCount(groups: Record<string, ColorGroup>): bigint {
  if (Object.keys(groups).length === 0) {
    return 1n;
  }

  const order = topoSortColorGroups(groups);

  if (!order) {
    return 1n;
  }

  // Per-position flag: does any later group consume this group's pick
  // (via `notEqualTo` or `contrastTo`)? If not, the recursion below
  // produces the same count for every candidate — we can multiply
  // instead of enumerating. This collapses an N₁ × N₂ × … × Nₖ
  // cartesian product into k group-walks for constraint-free styles
  // (e.g. pixel-art's 5.3M leaves → 8).
  const consumedByLater = new Array<boolean>(order.length).fill(false);

  for (let j = 0; j < order.length; j++) {
    const laterSpec = groups[order[j]];

    if (laterSpec.contrastTo) {
      const refIdx = order.indexOf(laterSpec.contrastTo);

      if (refIdx >= 0 && refIdx < j) {
        consumedByLater[refIdx] = true;
      }
    }

    for (const ref of laterSpec.notEqualTo ?? []) {
      const refIdx = order.indexOf(ref);

      if (refIdx >= 0 && refIdx < j) {
        consumedByLater[refIdx] = true;
      }
    }
  }

  const picks = new Map<string, string>();

  function enumerate(idx: number): bigint {
    if (idx === order!.length) {
      return 1n;
    }

    const name = order![idx];
    const spec = groups![name];
    const raw = (spec.values ?? []).map(normalizeHex);

    if (raw.length === 0) {
      return enumerate(idx + 1);
    }

    let candidates: string[];
    const contrastRef = spec.contrastTo
      ? picks.get(spec.contrastTo)
      : undefined;

    if (contrastRef) {
      candidates = sortByContrast(raw, contrastRef).slice(0, 1);
    } else {
      const excluded = new Set<string>();

      for (const ref of spec.notEqualTo ?? []) {
        const picked = picks.get(ref);

        if (picked !== undefined) {
          excluded.add(picked);
        }
      }

      const filtered = raw.filter((c) => !excluded.has(c));

      candidates = filtered.length > 0 ? filtered : raw;
    }

    if (!consumedByLater[idx]) {
      return BigInt(candidates.length) * enumerate(idx + 1);
    }

    let total = 0n;

    for (const hex of candidates) {
      picks.set(name, hex);
      total += enumerate(idx + 1);
    }

    picks.delete(name);

    return total;
  }

  return enumerate(0);
}

function initialsUsage(definition: StyleDefinition): InitialsUsage {
  const usage: InitialsUsage = { initial: false, initials: false };

  collectInitialsUsage(definition.canvas?.elements, usage);

  for (const component of Object.values(definition.components ?? {})) {
    if (isAlias(component)) {
      continue;
    }

    for (const variant of Object.values(component.variants ?? {})) {
      collectInitialsUsage(variant.elements, usage);
    }
  }

  return usage;
}

// Counts distinct uppercased characters reachable through `\p{L}` — the
// character class Initials.fromSeed (src/js/core/src/Utils/Initials.ts:21)
// uses to match base letters. Computed once at module load; reflects the
// host runtime's Unicode tables (~140k codepoints, ~200 ms).
const LETTER_CARDINALITY: number = (() => {
  const upper = new Set<string>();
  const letter = /\p{L}/u;

  for (let cp = 0; cp <= 0x10ffff; cp++) {
    const c = String.fromCodePoint(cp);

    if (letter.test(c)) {
      upper.add(c.toUpperCase());
    }
  }

  return upper.size;
})();

// Distinct text outcomes the renderer can emit when a definition references
// the `initial` and/or `initials` variables. `initials` returns 0, 1, or 2
// uppercased letters (Initials.fromSeed); `initial` is its first UTF-16 unit
// (Renderer.ts:519-522), so it adds no extra distinct outputs when the
// definition also uses `initials`. Combining marks (`\p{M}*`) are ignored —
// they extend the symbol space without changing the leading-letter cardinality
// the seed actually drives.
function initialsTextCardinality(usage: InitialsUsage): bigint {
  const n = BigInt(LETTER_CARDINALITY);

  if (usage.initials) {
    return n * n + n + 1n;
  }

  if (usage.initial) {
    return n + 1n;
  }

  return 1n;
}

// Below this many digits the number is shown as comma-grouped digits;
// above it we switch to scientific notation with 3 significant figures,
// since 30+ digit groupings are unreadable in the docs table.
const SCIENTIFIC_THRESHOLD_DIGITS = 16;

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((c) => SUPERSCRIPT_DIGITS[c] ?? c)
    .join('');
}

function formatCount(count: bigint): string {
  const digits = count.toString().length;

  if (digits <= SCIENTIFIC_THRESHOLD_DIGITS) {
    return count.toLocaleString('en-US');
  }

  // Round to 3 significant figures using BigInt arithmetic so we never lose
  // precision converting through Number.
  const exp = digits - 1;
  const divisor = 10n ** BigInt(exp - 2);
  let rounded = (count + divisor / 2n) / divisor;
  let realExp = exp;

  if (rounded.toString().length === 4) {
    // Rounding overflowed (e.g. 9.99 → 10.00); shift the exponent.
    rounded = rounded / 10n;
    realExp = exp + 1;
  }

  const mantissaDigits = rounded.toString();
  const mantissa = `${mantissaDigits[0]}.${mantissaDigits.slice(1)}`;

  return `≈ ${mantissa} × 10${toSuperscript(realExp)}`;
}

// BigInts aren't JSON-serializable, so we ship a `Math.log10`-style magnitude
// alongside the display string. Doubles handle exponents up to ~308, well
// above any count we produce. Leading-digit precision is bounded by the 15
// digits taken into `head` — plenty for sort comparisons.
function bigintLog10(n: bigint): number {
  const s = n.toString();

  if (s.length === 0 || s === '0') {
    return 0;
  }

  const headLength = Math.min(s.length, 15);
  const head = Number(s.slice(0, headLength));

  return s.length - headLength + Math.log10(head);
}

// Counts the distinct color tuples over the groups in `mask`. Groups
// outside the mask are dropped along with the constraints that point at
// them: a `notEqualTo` against a color nobody sees excludes no visible
// outcome (every hidden palette with two or more colors lets the visible
// group reach its whole palette), and a `contrastTo` against a hidden
// color is counted as a free pick over its palette, which can overcount
// by that palette's size (2 in every shipped style, and never reached).
function visibleColorCount(
  definition: StyleDefinition,
  groups: GroupIndex,
  mask: GroupMask,
): bigint {
  const visible: Record<string, ColorGroup> = {};

  for (const [name, group] of Object.entries(definition.colors ?? {})) {
    if (!groups.has(name, mask)) {
      continue;
    }

    visible[name] = {
      ...group,
      notEqualTo: group.notEqualTo?.filter((ref) => groups.has(ref, mask)),
      contrastTo:
        group.contrastTo && groups.has(group.contrastTo, mask)
          ? group.contrastTo
          : undefined,
    };
  }

  return jointColorCount(visible);
}

export function computeCount(definition: StyleDefinition): AvatarUniqueCount {
  const groups = new GroupIndex(definition);
  const colorCounts = new Map<GroupMask, bigint>();
  let count = 0n;

  for (const [mask, renderings] of componentOutcomes(definition, groups)) {
    let colors = colorCounts.get(mask);

    if (colors === undefined) {
      colors = visibleColorCount(definition, groups, mask);
      colorCounts.set(mask, colors);
    }

    count += renderings * colors;
  }

  count *= initialsTextCardinality(initialsUsage(definition));

  return { display: formatCount(count), log10: bigintLog10(count) };
}
