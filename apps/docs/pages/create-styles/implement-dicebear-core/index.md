---
title: Implement DiceBear Core
description: >
  Step-by-step guide for implementing DiceBear Core in any programming language.
  Covers the PRNG contract, options resolution, and SVG rendering pipeline.
---

# Implement DiceBear Core

This guide explains how to implement DiceBear Core in any programming language.
A correct implementation produces **byte-identical SVGs** to the
[JavaScript](https://github.com/dicebear/dicebear/tree/11.x/src/js/core),
[PHP](https://github.com/dicebear/dicebear/tree/11.x/src/php/core),
[Python](https://github.com/dicebear/dicebear/tree/11.x/src/python/core),
[Rust](https://github.com/dicebear/dicebear/tree/11.x/src/rust/core),
[Go](https://github.com/dicebear/dicebear/tree/11.x/src/go/core),
[Dart](https://github.com/dicebear/dicebear/tree/11.x/src/dart/core) and
[C#](https://github.com/dicebear/dicebear/tree/11.x/src/csharp/core) reference
implementations for the same seed and style definition.

## Architecture overview

```
Avatar(definition, options)
  │
  ├── Style        Parse and validate the definition JSON
  ├── Options      Resolve options using the PRNG
  └── Renderer     Generate SVG from resolved style + options
        │
        ├── Prng          Deterministic random number generator
        │   ├── Fnv1a     FNV-1a 32-bit hash
        │   └── Mulberry32  Stateful PRNG
        │
        └── SVG output
```

The core is intentionally minimal. It takes a
[style definition](/create-styles/definition-schema/) and user options, resolves
randomizable values through a deterministic PRNG, and renders an SVG string.

## Where to start

Build the modules in the order the parity fixtures can check them, and let each
fixture pass before moving on. The fixtures are described in
[Testing your implementation](#testing-your-implementation).

| Step | Build                                                  | Passes                                 | Read                                                                                         |
| ---- | ------------------------------------------------------ | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1    | `Fnv1a` and `Mulberry32`                               | `fnv1a.json`, `mulberry32.json`        | [PRNG contract](#prng-contract)                                                              |
| 2    | The `Prng` methods and number formatting               | `prng.json`, `numbers.json`            | [Selection methods](#selection-methods), [Number formatting](#number-formatting)             |
| 3    | `Style`: schema validation, aliases, animations        | `validation.json`                      | [Definition schema](/create-styles/definition-schema/), [Validation](#validation)            |
| 4    | The `Color` helpers                                    | `colors.json`                          | [Color options](#color-options)                                                              |
| 5    | `Initials`                                             | `initials.json`                        | [Initials extraction](#initials-extraction)                                                  |
| 6    | `Options`, `Resolver`, `Renderer`, `OptionsDescriptor` | `avatars/*.json`, `descriptors/*.json` | [Options resolution](#options-resolution), [SVG rendering pipeline](#svg-rendering-pipeline) |

Steps 1 to 5 are pure functions with small inputs, and most parity bugs sit
there. Step 6 composes everything: start with the `initials` style, which has
two components and one text element, and end with `declarative`, which exercises
every animation feature. A port is complete when every fixture passes. The seven
reference implementations are all structured along these lines, so any of them
can serve as a map.

## PRNG contract

The PRNG is the interoperability surface. If your PRNG produces the same outputs
as the reference for the same inputs, your implementation will produce identical
SVGs. Get this right first.

### FNV-1a 32-bit hash

[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
converts a string into a 32-bit unsigned integer. DiceBear iterates over
**UTF-16 code units** (not bytes, not code points).

```
offset_basis = 0x811c9dc5
prime        = 0x01000193

function fnv1a_hash(input: string) -> uint32:
    hash = offset_basis
    for each UTF-16 code unit c in input:
        hash = hash XOR c
        hash = hash * prime  (32-bit multiply, discard overflow)
    return hash as unsigned 32-bit
```

In JavaScript, `input.charCodeAt(i)` returns UTF-16 code units directly.
Languages without native UTF-16 strings must convert first. Outside the Basic
Multilingual Plane (e.g. emoji), code units and code points diverge, and using
code points instead produces wrong hashes for those inputs. The PHP reference
does the conversion explicitly:

```php
unpack('v*', mb_convert_encoding($input, 'UTF-16LE', 'UTF-8'))
```

Java and C# can iterate `string.charAt(i)` / `char` directly. For other
languages, transcode to UTF-16 and read 16-bit units.

**Reference (JS):**

```js
static hash(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
```

### Mulberry32

[Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c)
is a stateful PRNG that converts a 32-bit seed into a sequence of pseudo-random
numbers. The implementation must match Tommy Ettinger's C reference exactly.

```
function mulberry32_next(state) -> (uint32, new_state):
    state = (state + 0x6D2B79F5) as signed 32-bit
    z = state
    z = (z XOR (z >>> 15)) * (z OR 1)    (32-bit multiply)
    z = z XOR (z + ((z XOR (z >>> 7)) * (z OR 61)))  (32-bit multiply)
    return (z XOR (z >>> 14)) as unsigned 32-bit

function mulberry32_next_float(state) -> (float, new_state):
    (value, new_state) = mulberry32_next(state)
    return value / 2^32
```

**Reference (JS):**

```js
next() {
  const z = (this.#state = (this.#state + 0x6d2b79f5) | 0);
  let t = Math.imul(z ^ (z >>> 15), z | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0);
}

nextFloat() {
  return this.next() / 4294967296; // 2^32
}
```

Key details:

- `| 0` forces 32-bit signed integer (handles overflow)
- `>>> 0` converts back to unsigned 32-bit
- `Math.imul` performs 32-bit integer multiplication
- `nextFloat()` returns a value in `[0, 1)` by dividing by `2^32`
- The state is **stateful**: it advances with each call to `next()`
- Languages with 64-bit integers but no native `uint32_t` (e.g. PHP, Lua) must
  implement the 32-bit multiply manually: a naïve `uint32 * uint32` exceeds
  `2^63 - 1` and silently overflows. The PHP reference splits one operand into
  16-bit halves; see
  [`Prng/Mulberry32.php::mul`](https://github.com/dicebear/dicebear/blob/11.x/src/php/core/src/Prng/Mulberry32.php).

### Key-based value generation

DiceBear does not call the PRNG sequentially. Instead, each random decision uses
a **key** to derive an independent value. This makes the output independent of
call order.

```
function getValue(seed: string, key: string) -> float:
    hash = fnv1a_hash(seed + ":" + key)
    prng = new Mulberry32(hash)
    return prng.nextFloat()
```

For example, `getValue("alice", "eyesVariant")` always returns the same float,
regardless of whether `getValue("alice", "mouthVariant")` was called before or
after.

### Selection methods

For inputs with more than one entry, every selection method first normalizes:

1. **Deduplicate** by the item's string representation, keeping the first
   occurrence (`pick` and `shuffle` only; `weightedPick` operates on a map and
   has unique keys by construction).
2. **Sort** by the item's string representation using UTF-16 code unit
   comparison (JavaScript's default `.sort()` order).

Empty inputs return `undefined` (or an empty array for `shuffle`); single-entry
inputs are returned verbatim without deduplication or sorting. Both
normalization steps make multi-entry output independent of caller ordering and
duplicates. In practice the only values ever sorted are component variant names
and hex color strings (both guaranteed to be ASCII), so an implementation may
compare with `strcmp` and stay parity-correct, even though the JavaScript
reference compares full UTF-16 code units. The PHP reference does exactly this.

#### `pick(key, items) -> item | undefined`

Selects one item from an array.

```
function pick(seed, key, items):
    if items is empty: return undefined
    if items has 1 item: return items[0]
    unique = deduplicate items by string representation
    if unique has 1 item: return unique[0]
    sorted = sort unique by string representation
    index = floor(getValue(seed, key) * length(sorted))
    return sorted[index]
```

#### `weightedPick(key, weights) -> key | undefined`

Takes a map of `string → weight` and returns one of the map's keys, biased by
weight. When every weight is `0`, falls back to an unweighted `pick` across the
keys.

```
function weightedPick(seed, key, weights):
    keys = keys of weights
    if keys is empty: return undefined
    if keys has 1 item: return keys[0]
    sorted = sort keys by string representation
    totalWeight = sum of weights[k] for k in sorted
    if totalWeight == 0: return pick(seed, key, sorted)
    threshold = getValue(seed, key) * totalWeight
    cumulative = 0
    for each k in sorted:
        cumulative += weights[k]
        if threshold < cumulative: return k
    return last(sorted)
```

#### `bool(key, likelihood) -> boolean`

Returns `true` with probability `likelihood / 100`. `likelihood` defaults to
`50`.

```
function bool(seed, key, likelihood = 50):
    return getValue(seed, key) * 100 < likelihood
```

#### `float(key, range) -> number`

Returns a float in the closed range, rounded to four decimal places. `range` is
the schema's `{ min, max, step? }` object. If `min > max`, swap them internally.
With `step > 0`, sample uniformly from
`{ min + i × step | 0 ≤ i ≤ ⌊(max − min) / step⌋ }`, so when `(max − min)` is
not a multiple of `step`, the last bucket is `≤ max` and `max` itself is only
hit when the division is exact. Without `step`, the range is continuous.

```
function float(seed, key, range):
    min = min(range.min, range.max)
    max = max(range.min, range.max)
    step = range.step if range.step > 0 else 0

    if step > 0:
        buckets = floor((max - min) / step) + 1
        i = floor(getValue(seed, key) * buckets)
        raw = min + i * step
    else:
        raw = min + getValue(seed, key) * (max - min)

    return round(raw * 10000) / 10000   # round halves toward +Infinity
```

The `round` here is the same as in [number formatting](#number-formatting):
halves round **toward +Infinity** (JavaScript's `Math.round`), not your
language's native rounding. PHP's `round()` and many others round halves _away
from zero_, which diverges for negative values landing exactly on a `.5`
boundary (e.g. `round(-0.40625 × 10000) / 10000` is `-0.4062`, not `-0.4063`).

#### `integer(key, range) -> number`

Returns an integer in the closed range, inclusive on both ends. Accepts the same
`{ min, max, step? }` object as `float`; `step` is accepted for symmetry but
ignored, since integers already step by 1.

```
function integer(seed, key, range):
    min = min(range.min, range.max)
    max = max(range.min, range.max)
    return floor(getValue(seed, key) * (max - min + 1)) + min
```

#### `shuffle(key, items) -> items[]`

Fisher-Yates shuffle using a **stateful** Mulberry32 instance (not key-based).
For inputs of length ≤ 1 the items are returned as a copy without deduplication.

```
function shuffle(seed, key, items):
    if length(items) <= 1: return copy of items
    unique  = deduplicate items by string representation
    sorted  = sort unique by string representation
    result  = copy of sorted
    prng    = new Mulberry32(fnv1a_hash(seed + ":" + key))

    for i from length(result) - 1 down to 1:
        j = floor(prng.nextFloat() * (i + 1))
        swap result[i] and result[j]

    return result
```

Note: `shuffle` is the only method that uses a stateful PRNG instance directly
(calling `nextFloat()` multiple times). All other methods call `getValue()`
which creates a fresh PRNG for each key.

## Options resolution

The `Options` class resolves raw user options into concrete values used by the
renderer. Each resolution uses the PRNG with a specific key.

### Core options

| Option                  | PRNG key                | Resolution                                                                                            |
| ----------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `seed`                  | —                       | Literal string; defaults to `''` if not provided. Not memoized.                                       |
| `size`                  | —                       | Literal number; defaults to unset (renderer omits `width`/`height`).                                  |
| `idRandomization`       | —                       | Boolean; defaults to `false`. Uses host RNG, not the DiceBear PRNG.                                   |
| `title`                 | —                       | Literal string; defaults to unset (omits `<title>`, uses `aria-hidden`).                              |
| `flip`                  | `flip`                  | `pick` from `['none', 'horizontal', 'vertical', 'both']`, default `'none'`                            |
| `rotate`                | `rotate`                | `float` from range, default `0`                                                                       |
| `scale`                 | `scale`                 | `float` from range, default `1`                                                                       |
| `borderRadius`          | `borderRadius`          | `float` from range, default `0`                                                                       |
| `translateX`            | `translateX`            | `float` from range, default `0`                                                                       |
| `translateY`            | `translateY`            | `float` from range, default `0`                                                                       |
| `fontFamily`            | `fontFamily`            | `pick` from array, default `'system-ui'`                                                              |
| `fontWeight`            | `fontWeight`            | `pick` from array, default `400`                                                                      |
| `tags`                  | —                       | Parsed token list, empty when unset; no memo, never in `resolvedOptions`                              |
| `animation`             | —                       | Boolean, default `false`; a `${name}Animation` switch wins for its timelines (see below)              |
| `${name}Animation`      | —                       | Boolean, only for named timelines the style carries; recorded when set and met                        |
| `animationSpeed`        | `animationSpeed`        | `float` from range, default `1`                                                                       |
| `${name}AnimationSpeed` | `${name}AnimationSpeed` | `float` from range, default is the global factor; only for playing timelines of that name (see below) |
| `animationDelay`        | `animationDelay`        | `float` from range, default `0`; a start offset in seconds                                            |
| `${name}AnimationDelay` | `${name}AnimationDelay` | `float` from range, default is the global offset; only for playing timelines of that name             |

Options with no PRNG key are read directly from the user input. The rest sample
from a user-supplied range/list under the given key, falling back to the listed
default.

The range options (`rotate`, `scale`, `borderRadius`, `translateX`,
`translateY`, `animationSpeed`, `animationDelay`, and the per-color
`${name}ColorAngle` / `${name}ColorFillStops`) accept a number or an array,
normalized to a `{ min, max }` range before `float`/`integer` sampling:

- a bare number `n` → `{ min: n, max: n }` (a fixed value);
- a single-element array `[n]` → `{ min: n, max: n }` (same as the bare number);
- a two-element array → `{ min, max }` taken as the smaller/larger of the two
  (order does not matter, sampling swaps them anyway);
- an empty array `[]`, or the option unset, → fall back to the listed default.

Note the edge cases: `[n]` is a fixed value (**not** the default), and `[]`
falls back to the default (**not** a range with a missing bound). A fixed range
where `min === max` always samples that exact value.

`tags` is read directly and parsed into tokens (see
[Tag filtering](#tag-filtering)). `animation` is the one core option with a memo
but no PRNG draw: whether an avatar moves must not depend on the seed. Both
animation options are read only while rendering an element that carries
`animations` (see [Animation rendering](#animation-rendering)), so the
`resolvedOptions` snapshot of a static style never contains them, while an
animated style records `animation: false` even when the user left the option
unset.

#### Switches and speeds per animation name

`${name}Animation` switches the timelines of one name on or off and wins over
`animation` for them. `${name}AnimationSpeed` sets their factor, with the same
values as `animationSpeed`, and wins over it. `${name}AnimationDelay` sets their
start offset in seconds the same way, with the same values as `animationDelay`
(default `0`, `-3600` to `3600`), and wins over it. A named timeline plays when
its switch says so, or when the global switch does and no switch of its own is
set, and it plays at its own factor when one is set, at the global factor
otherwise. Unnamed timelines follow the global switch and factor alone. A switch
is recorded in `resolvedOptions` under its key when the renderer meets a
timeline of that name, a factor or offset is drawn under `${name}AnimationSpeed`
or `${name}AnimationDelay` the first time a playing timeline of that name asks
for it, or the animation hash does. Nothing is recorded for a name the style
does not carry, and a static render records only `animation`.

### Component options

For each component (e.g. `eyes`) the user can supply two options, and the global
`tags` filter narrows the pool from the outside:

| Option            | PRNG key          | Resolution                                                                                                     |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `eyesProbability` | `eyesProbability` | `bool` with likelihood from the user option, falling back to the component's `probability` (or `100` if unset) |
| `eyesVariant`     | `eyesVariant`     | `weightedPick` over a weighted map (see below)                                                                 |

If the probability check fails, the component is not rendered and `variant`
returns `undefined`.

`eyesVariant` accepts three shapes from the user: a single variant name, an
array of names, or a `Record<string, number>` weight map. Normalize the first
two to a map where each named variant has weight `1`. Then drop any keys that
are not declared in the component's `variants` block, and feed the remaining map
to `weightedPick`. When the user did not supply the option, take every variant,
or only the ones that survive the [tag filter](#tag-filtering) when `tags` has
at least one token, and build the map from the variants' own `weight` values
(defaulting to `1`). A user-set `${name}Variant` therefore bypasses the tag
filter for that component. A variant with `weight: 0` is only ever drawn when
the tag filter or the variant option leaves the pool with a zero total, in which
case `weightedPick` falls back to `pick`.

For **component aliases** (declared via `extends` in the definition), the user
side is shared and only the PRNG side is independent. An alias does not expose
its own `${aliasName}Probability` or `${aliasName}Variant` user option. Both are
read from the source component's `${sourceName}Probability` and
`${sourceName}Variant`. The PRNG, however, uses the alias's own name as the key
(`${aliasName}Probability`, `${aliasName}Variant`), so each alias rolls its
visibility and variant independently while still being constrained by the same
user-set weights.

### Tag filtering

A variant may carry a `tags` array of tokens `category` or `category:value`. The
`tags` option carries the same tokens, each optionally prefixed with `!`. Parse
every user token once per avatar into `{ category, value?, negated }` by
stripping the leading `!` and splitting at the first `:`. Then sort the tokens
into four groups:

```
allows        category -> [values]   positive `category:value` tokens
bares         set of categories      positive `category` tokens
disallows     [{category, value?}]   every negated token
bareDisallows set of categories      negated `!category` tokens
```

Two lookups on a variant's tags drive the filter:

```
hasTag(category)        any tag equals `category` or starts with `category:`
hasTag(category, value) any tag equals `category:value`
```

For a component, first decide which bare tokens bind: a bare category is
`required` only when it is not in `bareDisallows` and at least one variant of
this component has a tag in it. A bare token therefore turns on a category where
the style uses it and leaves every other component untouched. Then keep a
variant when all of these hold:

1. For every `(category, values)` in `allows`, the variant has no tag in that
   category, or has one of the allowed `category:value` tags. Values within a
   category combine with "or", categories with "and".
2. For every `required` category, the variant has a tag in it.
3. No disallow matches: `!category:value` matches the exact tag, `!category`
   matches any tag in the category. A disallow wins over any allow.

The surviving variants keep their definition order, so the weighted map fed to
`weightedPick` is built in that order. A `category:value` token whose value no
variant carries drops every variant tagged in that category, while a category no
variant uses has no effect. An empty pool means the component is not drawn.

The options descriptor advertises `tags` only when at least one variant of the
style carries a tag, as an open enum:

```json
"tags": { "type": "enum", "values": ["animation", "animation:slow"], "list": true, "open": true }
```

`values` is the sorted union of every tag across all variants, and `open` tells
tooling that the option also accepts `!` disallows and bare categories outside
that list.

### Per-component transforms (render-time)

Each component reference also has a rotation, two translations, and a scale
applied at render time. These are **not user options**: they are sampled per
render from the component definition's `rotate`/`translate`/`scale` ranges. They
land in the introspective `resolvedOptions` snapshot under `${name}Rotate` /
`${name}TranslateX` / `${name}TranslateY` / `${name}Scale`, but they are not
part of the user-facing `StyleOptions<D>` type and feeding them back into a new
`Avatar` is not supported.

| Value      | PRNG key         | Sampling                                          |
| ---------- | ---------------- | ------------------------------------------------- |
| rotate     | `eyesRotate`     | `float` from `component.rotate`, default `0`      |
| translateX | `eyesTranslateX` | `float` from `component.translate.x`, default `0` |
| translateY | `eyesTranslateY` | `float` from `component.translate.y`, default `0` |
| scale      | `eyesScale`      | `float` from `component.scale`, default `1`       |

The translate values are percentages of the **component's own** `width` and
`height` (not the avatar canvas); multiply by the component dimension to get the
offset. Like every emitted number it is then run through
[`formatNumber`](#number-formatting) (which caps it at 5 decimal places). The
transform center `(cx, cy)` for rotate and scale is the component's own center:
`(width / 2, height / 2)`.

In the emitted SVG, the non-identity values are concatenated (space-separated)
into a single `transform` attribute on the `<use>` element, in this textual
order (read left to right):

```
transform="translate(tx, ty) rotate(angle, cx, cy) translate(cx, cy) scale(s) translate(-cx, -cy)"
```

Rules:

- Translate is one segment, emitted if either `tx ≠ 0` or `ty ≠ 0`.
- Rotate is one segment, emitted if `angle ≠ 0`.
- Scale is the three-part `translate cx,cy / scale s / translate -cx,-cy`
  fragment, emitted as a single unit if `s ≠ 1`.
- If all of `(tx, ty, angle, s)` are identity, the `transform` attribute is
  omitted entirely.
- If the style author wrote a `transform` on the component reference, it is
  prepended verbatim ahead of these segments (see
  [Component rendering](#component-rendering)).

### Color options

For each color group declared in the definition (**plus** an implicit
`background` group) the user can supply five options:

| Option                  | Type                                     | PRNG key                | Notes                                                                             |
| ----------------------- | ---------------------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `${name}Color`          | hex string or list                       | `${name}Color`          | Candidate colors (overrides the definition palette); normalized via `Color.toHex` |
| `${name}ColorFill`      | enum `solid` / `linear` / `radial`       | `${name}ColorFill`      | `pick` over a list, default `'solid'`                                             |
| `${name}ColorFillStops` | integer ≥ 2, or `[min, max]` of same     | `${name}ColorFillStops` | `integer` sample, default `2`; ignored when fill is `solid`                       |
| `${name}ColorAngle`     | number in `[-360, 360]`, or `[min, max]` | `${name}ColorAngle`     | `float` sample, default `0`                                                       |
| `${name}ColorOrder`     | enum `random` / `fixed`                  | none                    | Single value, no PRNG draw; default `'random'`                                    |

The resolver-level `colorOrder` accessor returns the user value or `'random'`.
Unlike `colorFill` it is not memoized into the resolved-options snapshot: it is
no PRNG pick, so the snapshot stays unchanged for existing inputs.

Resolution for each group:

1. Get candidate colors from the user option (`${name}Color`) or fall back to
   the style definition's palette. From here on both sources are treated the
   same.
2. Normalize every candidate to lowercase hex (6 or 8 digits, leading `#`).
   3-/4-digit shorthand expands to 6/8.
3. Determine the number of stops: `1` if fill is `solid`, otherwise sample
   `${name}ColorFillStops` (PRNG `integer`). When the option is unset the
   fallback is `2`, or with `${name}ColorOrder: 'fixed'` the candidate count,
   measured before the `notEqualTo` filtering below.
4. Apply constraints from the style definition:
   - **`contrastTo`**: Sort the candidates by WCAG 2.1 contrast ratio
     (descending) against the referenced color. The reference is resolved by
     calling the color-resolver recursively, so cycles must be detected and
     rejected. Skipped with `'fixed'`: the given order wins.
   - **`notEqualTo`**: Strip the alpha channel from every candidate and every
     already-picked color in the referenced groups, then drop the matches. If
     filtering would empty the candidate list, fall back to the unfiltered list:
     color constraints are best-effort, not hard. Applies regardless of
     `${name}ColorOrder`.
5. Order the candidates. If the definition declares `contrastTo`, keep the
   current order, even when the sort itself was skipped because the reference
   resolved to no color. Otherwise shuffle, unless `${name}ColorOrder` is
   `'fixed'`: the candidates then keep exactly their given order, duplicates
   included, whether they come from the option or from the palette.
6. Slice to the number of stops.

A group declared without a color entry in the style definition (the implicit
`background` group is the most common case) skips constraint handling entirely
and orders the user-supplied candidates as in step 5.

#### WCAG 2.1 contrast ratio

The contrast sort is the most likely source of subtle parity drift between
ports. Small differences in the linearization cutoff or the luminance
coefficients change the ordering on certain palettes. These are the defining
formulas:

```
function linearize(channel: uint8) -> float:
    s = channel / 255
    if s <= 0.04045:
        return s / 12.92
    return ((s + 0.055) / 1.055) ^ 2.4

function luminance(hex: string) -> float:
    (r, g, b) = parseHex(hex)
    return 0.2126 * linearize(r)
         + 0.7152 * linearize(g)
         + 0.0722 * linearize(b)

function contrastRatio(a: hex, b: hex) -> float:
    la = luminance(a)
    lb = luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
```

The cutoff is `0.04045`, the exponent is `2.4`, and the coefficients are
`0.2126 / 0.7152 / 0.0722` for R/G/B respectively. Sorting is descending by
`contrastRatio(candidate, refColor)` and must be **stable** (equal ratios keep
their input order).

::: warning Do not compute the linearization at runtime

IEEE 754 does not require `pow` to be correctly rounded, and real
implementations disagree in the last bit: V8's `Math.pow`, the C math library
(used by PHP, Python, and Rust), and Go's pure-Go `math.Pow` each produce a
different result for some channel values. A port that evaluates
`((s + 0.055) / 1.055) ^ 2.4` at runtime will fail the parity fixtures on some
inputs, and a JavaScript build would even differ between browser engines.

`linearize` has only 256 possible inputs, so every reference implementation
embeds a precomputed lookup table with the 256 results instead. Copy it from any
reference port (e.g.
[`Color.ts`](https://github.com/dicebear/dicebear/blob/11.x/src/js/core/src/Utils/Color.ts)).
Decimal-literal parsing is correctly rounded in every mainstream language, so
the table yields bit-identical doubles everywhere, and the remaining arithmetic
(`+`, `×`, `÷`) is exactly specified by IEEE 754.

One more trap: compilers that fuse `a × b + c` into a single FMA instruction
(e.g. Go on arm64) round once instead of twice and drift in the last ULP. The
weighted sum in `luminance` must round after every product. In Go that takes
explicit `float64(...)` conversions around each product.

:::

## SVG rendering pipeline

The renderer walks the element tree and generates an SVG string. The
transformations are applied in a specific order. Getting this wrong will produce
different output.

### Number formatting

Every number emitted into the SVG (`viewBox` dimensions, `width`/`height`, the
translate/rotate/scale offsets and their centers, `rx`/`ry`, gradient stop
offsets, the `fontWeight` variable, and so on) is stringified through a single
helper so that all implementations produce byte-identical output:

```
function formatNumber(value):
    scaled = round(value * 100000)   # round halves toward +Infinity
    sign = "-" if scaled < 0 else ""
    scaled = abs(scaled)

    integer  = floor(scaled / 100000)
    fraction = (scaled mod 100000), padded to 5 digits, then trailing zeros removed

    if fraction is empty:
        return sign + integer
    return sign + integer + "." + fraction
```

This rounds to at most **5 decimal places** and always uses plain decimal
notation (never scientific/exponential), with no trailing zeros and no trailing
`.0` (e.g. `1`, `-50`, `2.5`, `0.00001`). Build the string from the integer
`scaled` rather than the language's native float-to-string: PHP's
precision-based cast and Python's `repr` both diverge from JavaScript for small,
large, or fractional values. The `round` step rounds halves toward +Infinity
(JavaScript's `Math.round`); emulate it precisely: `floor(x + 0.5)` is **not**
equivalent (it is wrong for the largest double below `0.5`, where it yields `1`
instead of `0`).

### 1. Background

The renderer unconditionally asks the resolver for the `background` color group:
every style has it implicitly, even when the style definition declares no
`background` group. If the resolved list is non-empty, emit a
`<rect width="{w}" height="{h}" fill="{fill}"/>` as the first body element.
`{fill}` is either a literal hex string (solid fill, or a single candidate
color) or a `url(#…)` reference to a gradient registered in `<defs>`. See
[Gradient rendering](#gradient-rendering).

### 2. Element tree

Walk the `canvas.elements` array recursively:

- **`element`**: Render as `<{name} {attrs}/>` (self-closing) when there are no
  children, otherwise `<{name} {attrs}>{children}</{name}>`. Resolve color and
  variable references in attribute values, then XML-escape the resolved values.
  Element names and attribute keys are written verbatim because the schema
  validator already restricted them to a safe allowlist.
- **`text`**: Resolve any variable reference, then XML-escape and emit the
  result as the parent's text content.
- **`component`**: Look up the selected variant (from options resolution). If
  the component is visible, emit a `<use>` element pointing at a `<defs>` entry
  that holds the variant body (see below).

An `element` or `component` node may also carry an `animations` array. When the
`animation` option selects one of its timelines, the rendered markup (the
element, or the `<use>` call site) is wrapped in animated `<g>` elements, see
[Animation rendering](#animation-rendering).

When an `element` has the name `defs`, the renderer **does not** emit a `<defs>`
tag inline. Instead, each child is rendered and pushed into the shared `<defs>`
block that the renderer accumulates over the whole walk (alongside generated
gradients, clip paths, and component variant bodies). The map key is the child's
`id` attribute when present, otherwise a synthetic `_{n}` slot, so two children
with the same `id` collapse to one entry, last writer wins. This lets style
definitions ship reusable fragments without breaking the
single-`<defs>`-per-document invariant.

#### Component rendering

A component reference is never inlined. The first time the renderer encounters a
`(component, variant)` pair, it:

1. Renders the variant's element tree.
2. Wraps it in `<g id="{sourceName}-{variantName}-{seedHash}">…</g>` and appends
   it to the shared `<defs>` block. `sourceName` is the _source_ component name.
   For an alias declared via `extends`, this is the name of the component the
   alias points to, so every alias referencing the same source shares a single
   `<defs>` entry.
3. At the call site, emits `<use {attributes} href="#{id}"/>` where
   `{attributes}` carries:
   - Every attribute the style author wrote on the component reference itself
     (rendered first, in iteration order).
   - A `transform` attribute composed of the per-component transforms (see
     [Per-component transforms](#per-component-transforms-render-time)). If the
     author also supplied a `transform`, it is **prepended** so it acts as the
     outermost (placement) transform, with the per-component values applied
     inside it. If all per-component values are identity and the author did not
     supply a transform, the attribute is omitted entirely.

`seedHash` is the FNV-1a hex hash of the seed, lowercased and zero-padded to 8
characters.

### 3. Transform order

The body (background plus rendered elements) is wrapped in nested `<g>`
elements. The list below is **outermost → innermost**: the border-radius clip is
always emitted, the others only when their value is non-identity.

1. **Border radius (always):** register a `<clipPath id="clip-{seedHash}">` in
   `<defs>` containing a `<rect width="{w}" height="{h}" rx="{rx}" ry="{ry}"/>`
   where `rx = (borderRadius / 100) * canvas.width` and
   `ry = (borderRadius / 100) * canvas.height`. Wrap the body in
   `<g clip-path="url(#clip-{seedHash})">`. **This wrap is emitted even when
   `borderRadius` is `0`** (with `rx="0" ry="0"`) so that transformed content
   cannot bleed past the canvas bounds.
2. **Translate** (skip if both are `0`): `<g transform="translate(dx, dy)">`
   where `dx = (translateX / 100) * canvas.width` and
   `dy = (translateY / 100) * canvas.height`.
3. **Rotate** (skip if `0`): `<g transform="rotate(angle, cx, cy)">` around
   canvas center, `cx = width / 2`, `cy = height / 2`.
4. **Flip** (skip if `none`) depends on mode:
   - `horizontal`: `translate(width, 0) scale(-1, 1)`
   - `vertical`: `translate(0, height) scale(1, -1)`
   - `both`: `translate(width, height) scale(-1, -1)`
5. **Scale** (skip if `1`):
   `<g transform="translate(cx, cy) scale(s) translate(-cx, -cy)">` where
   `cx = width / 2`, `cy = height / 2`.

Because border-radius is always wrapping the body, the rendered SVG always
contains a `<defs>` block with at least the `<clipPath>` entry.

### 4. SVG root element

The root `<svg>` element's attributes, in this order:

1. `xmlns="http://www.w3.org/2000/svg"`
2. `viewBox="0 0 {width} {height}"`
3. Global `attributes` from the style definition: keys verbatim from the
   allowlist, values XML-escaped
4. Either `role="img" aria-label="{title}"` (when `title` is set, escaped) or
   `aria-hidden="true"`
5. `width="{size}"` and `height="{size}"` (only when the `size` option is set)

Its children, in this exact order:

1. The generator comment
   `<!-- Generated by DiceBear (https://www.dicebear.com) -->`, always present
   and byte-identical across implementations.
2. `<metadata>`: the Dublin Core / RDF block from `meta` (see below); omitted
   entirely if `meta` is empty.
3. `<defs>`: the accumulated definitions (clip path, gradients, component
   variant bodies, and the animation `<style>` when any timeline played). Always
   present in practice because the border-radius clip is always registered.
4. `<title>`: only when the `title` option is set. Contents are escaped.
5. The transformed body from the previous step.

#### `<metadata>` block

The license/attribution metadata is emitted as a real `<metadata>` element with
RDF / Dublin Core terms, **not** as an HTML comment:

```xml
<metadata xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:dcterms="http://purl.org/dc/terms/">
  <rdf:RDF>
    <rdf:Description>
      <dc:title>{source.name}</dc:title>
      <dc:creator>{creator.name}</dc:creator>
      <dc:source xsi:type="dcterms:URI">{source.url}</dc:source>
      <dcterms:license xsi:type="dcterms:URI">{license.url}</dcterms:license>
      <dc:rights>{attribution text}</dc:rights>
    </rdf:Description>
  </rdf:RDF>
</metadata>
```

Each `dc:*` / `dcterms:*` field is only included when the corresponding `meta`
field is populated; if no field is populated, the `<metadata>` element is
omitted entirely. All text content is XML-escaped. The `<dc:rights>` value is a
single-line attribution string composed from `source`, `creator`, and `license`
(prefixed with `Remix of ` unless the style is MIT-licensed, authored by
DiceBear itself, or has no `source.name`).

### 5. ID randomization

When `idRandomization` is `true`, append a random suffix to every existing `id`
attribute and update every matching reference. The replacement patterns are
`id="…"`, `url(#…)`, and `href="#…"`; each occurrence is rewritten to
`{original}-{suffix}`.

The suffix format is **6 lowercase hex characters**, left-padded with zeros: in
JavaScript,
`Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')`.

The suffix **must be non-deterministic**: derive it from the host language's
non-seeded RNG (`Math.random()` in JavaScript, `random_int()` in PHP,
`random.randint()` in Python), not from the DiceBear PRNG. Two avatars rendered
with the same seed would otherwise still collide on their IDs, defeating the
purpose of the feature. Draw the suffix once per render and cache it: with this
option on, the animation class and keyframes names need the same suffix, and
since they are not `id` attributes the rewrite above never sees them. They pick
it up through the [animation hash](#names-and-the-animation-hash) instead. With
the option off, animations stay fully deterministic. Because the randomized
output is non-deterministic, it is excluded from parity testing: the avatar
fixtures use the default of `idRandomization: false`.

## Gradient rendering

A gradient is emitted only when the fill is `linear` or `radial` **and** the
color list has at least two entries. Otherwise the renderer returns a literal
hex string (`colors[0]`, or `'none'` when the list is empty).

When a gradient is needed:

1. Create a `<linearGradient>` (for `linear`) or `<radialGradient>` (for
   `radial`) in `<defs>`.
2. Calculate per-stop offsets: `formatNumber(i / (colors.length - 1) * 100)`
   followed by `%` (offsets are formatted like every other number, see
   [Number formatting](#number-formatting)).
3. Emit each color as `<stop offset="{offset}%" stop-color="{hex}"/>`.
4. Add `gradientTransform="rotate(angle, 0.5, 0.5)"` only when the resolved
   `${name}ColorAngle` is non-zero; omit the attribute entirely otherwise.
5. Reference the gradient via `url(#{id})` in the fill attribute that asked for
   it.
6. Gradient ID format: `{colorName}-color-{seedHash}` where `seedHash` is the
   FNV-1a hex hash of the seed (8 chars, zero-padded, lowercased).

## Animation rendering

A style definition may attach an `animations` array to any `element` or
`component` node (schema 1.6.0 and later). Each entry is one timeline with a
`duration` in seconds, a `tracks` map, and the optional fields `name`, `delay`,
`iterations`, `direction`, `fill`, `easing`, and `origin`. The renderer turns
the selected timelines into CSS: one `<g class="…">` wrapper per track around
the node's markup, plus a single `<style>` element in `<defs>` that holds the
`@keyframes` blocks and the class rules. With the `animation` option off (the
default) nothing of this is emitted and the output is byte-identical to that of
a renderer that does not know about animations. This is what keeps raster
conversions and the HTTP API static.

### Validation

The JSON schema cannot order array items, so the style constructor checks that
every track lists its keyframes in strictly ascending `at` order and rejects the
definition otherwise. The JavaScript reference reports the offending keyframe
under its JSON pointer path, for example
`/canvas/elements/0/animations/0/tracks/rotate/keyframes/1/at` (or the
`/components/{name}/variants/{variant}/elements/…` equivalent) with the message
`must be greater than the previous keyframe`. Only the accept/reject outcome is
part of the contract. A step jump is expressed with the `hold` easing, never
with two keyframes at the same position.

The schema itself rejects `animations` below a `defs` or a `clipPath` element
and on the elements a group cannot wrap (`stop`, `tspan`, `textPath`, `mpath`
and the filter primitives), so no constructor check is needed for them. The
wrappers the renderer adds would be lost in both places: a `<use>` clones only
the node it references, and a `<g>` is no valid clipPath content. Masks accept
groups, so animations below a `mask` element pass.

### Selecting timelines

A timeline plays when the resolver's `animationPlays(name)` says so: the
timeline's `${name}Animation` switch when the user set one, the global
`animation` switch otherwise, and always the global switch for an unnamed
timeline. No PRNG is involved. The global `animation` memo is touched the first
time the renderer meets a node that carries `animations`, regardless of whether
anything plays, so it is always part of `resolvedOptions` for an animated style.
`animationSpeed`, `animationDelay`, and the per-name factors and offsets are
only touched once a track is actually rendered.

### Wrappers

For a node with active timelines, collect one class name per track: timelines in
definition order, and within a timeline the tracks in this canonical order,
skipping absent ones:

```
translateX, translateY, rotate, scaleX, scaleY, opacity
```

Then wrap the rendered markup, first collected class outermost:

```html
<g class="dba-{hash}-0"><g class="dba-{hash}-1">…markup…</g></g>
```

Markup that rendered to the empty string is left alone: an `element` pruned for
having no children takes its animations with it. For a `component` the wrappers
go around the `<use>` call site, not around the variant body in `<defs>`, so two
references to the same variant can animate differently.

When the node has an `opacity` attribute and one of its active timelines has an
`opacity` track, the attribute moves from the node to the innermost opacity
wrapper. The keyframes then replace the resting value instead of multiplying
with it, which is how a CSS animation on the element itself would behave. The
attribute is rendered on the wrapper exactly like any other attribute (see the
`reveal` timeline in the `declarative` fixture, whose `<rect opacity="0">`
becomes `<g class="…" opacity="0"><rect …/></g>`). With the animation off the
attribute stays where the author put it.

### Names and the animation hash

Class names are `dba-{animationHash}-{n}` and keyframes names are
`dbk-{animationHash}-{m}`. `n` and `m` are separate zero-based counters in
emission order. `animationHash` is the FNV-1a hex hash (8 characters, lowercase,
zero-padded) of

```
{source.name or ''} + ':' + seed + ':' + formatNumber(animationSpeed) + ':' + formatNumber(animationDelay)
  [+ ':' + states]     // only when the style carries named timelines, see below
  [+ ':' + suffix]     // only when idRandomization is on: the same suffix the id rewrite uses
```

`states` lists every name the style carries in UTF-16 code unit order, joined
with `,`, each as `{name}:off` when its timelines do not play and as
`{name}:{formatNumber(factor)}:{formatNumber(offset)}` when they do, with the
factor `animationSpeedFor` and the offset `animationDelayFor` yield. A style
without named timelines has no such part. The first two parts equal the input of
the component-id hash. Compute the hash once per render and cache it. Two
renders of the same seed with different speeds or selections placed on one page
must not pick up each other's rules, while identical renders sharing identical
rules is harmless.

### Keyframes body

Pad the track's keyframes first: when the first keyframe has `at > 0`, prepend a
copy with `at: 0`, and when the last one has `at < 100`, append a copy with
`at: 100`. The resting value then holds outside the keyframed span. Each
keyframe becomes `{at}%{`, the declaration, the timing, and `}`, with `at` run
through `formatNumber`, and the body is the concatenation without separators.

| Track        | Declaration                   |
| ------------ | ----------------------------- |
| `translateX` | `transform:translateX({v}px)` |
| `translateY` | `transform:translateY({v}px)` |
| `rotate`     | `transform:rotate({v}deg)`    |
| `scaleX`     | `transform:scaleX({v})`       |
| `scaleY`     | `transform:scaleY({v})`       |
| `opacity`    | `opacity:{v}`                 |

`timing` is `;animation-timing-function:{easing}` and is emitted only when the
keyframe carries its own `easing`, is not the last keyframe of the padded list
(there is no following segment to shape), and its CSS form differs from the
timeline's default easing. The default easing is the timeline's `easing`, or
`linear` when unset.

Easings serialize as follows: the keywords `linear` and `ease` stay as they are,
`easeIn`, `easeOut`, and `easeInOut` become `ease-in`, `ease-out`, and
`ease-in-out`, and `hold` becomes `step-end`. A bezier object becomes
`cubic-bezier({x1}, {y1}, {x2}, {y2})` with each value through `formatNumber`
and a comma plus space between them.

Keyframes blocks are deduplicated by body: the first track that produces a given
body registers `@keyframes dbk-{hash}-{m}` with that body in braces, and later
tracks with the same body reuse that name. Class rules are never deduplicated.

### Class rule

Every track adds one rule to the class list:

```
.dba-{hash}-{n}{[transform-box:fill-box;transform-origin:{x}% {y}%;]animation:{duration}s {easing} {delay}s {iterations} {direction} {fill} dbk-{hash}-{m}}
```

- The `transform-box`/`transform-origin` prefix is present only for `rotate`,
  `scaleX`, and `scaleY`. `origin` defaults to `{ x: 50, y: 50 }`, and both
  values go through `formatNumber`.
- `duration` is `formatNumber(duration / speed)`, `delay` is
  `formatNumber((delay ?? 0) / speed + offset)`, where `speed` is the timeline's
  factor (its `${name}AnimationSpeed` option when the timeline is named and the
  user set one, the global `animationSpeed` otherwise) and `offset` the
  timeline's start offset in seconds from `${name}AnimationDelay` or
  `animationDelay` the same way, default `0`. The offset is added after the
  speed has scaled the authored delay, so it shifts by wall clock time. Negative
  delays are allowed and start the timeline mid-way.
- `iterations` is the literal `infinite` when the field is unset or
  `'infinite'`, otherwise `formatNumber(iterations)`.
- `direction` maps `alternateReverse` to `alternate-reverse`. The other three
  keywords are emitted as written. Default `normal`.
- `fill` is `none` or `forwards`, default `none`.
- `easing` is the timeline's default easing in CSS form.

All seven tokens of the shorthand are always emitted, and the keyframes name
comes last so it can never be mistaken for a keyword.

### The `<style>` entry

After the body has been rendered and wrapped, and before `<defs>` is serialized,
register the accumulated CSS as one more `<defs>` entry if at least one
keyframes block exists:

```
<style>@media (prefers-reduced-motion:no-preference){<keyframes blocks in registration order><class rules in emission order>}</style>
```

The map key is `animation-style`. An authored `<defs>` child may already use
that id, so append `-` to the key until it is free rather than replacing the
def. Because the entry is registered after the whole walk, it is the last child
of `<defs>`. The media query gives users who prefer reduced motion the static
avatar.

A style may still ship the older mechanism next to the declarative one: a
component with an authored `<style>` element, gated behind a tag. The `coexist`
fixture pins that both render side by side in one avatar.

### Options descriptor

When any node in the definition (canvas tree or component variants) has a
non-empty `animations` array, the descriptor gains a switch, a speed and a delay
field, plus one triple per distinct timeline name in UTF-16 code unit order:

```json
"animation": { "type": "boolean" },
"animationSpeed": { "type": "range", "min": 0.1, "max": 10 },
"animationDelay": { "type": "range", "min": -3600, "max": 3600 },
"driftAnimation": { "type": "boolean" },
"driftAnimationSpeed": { "type": "range", "min": 0.1, "max": 10 },
"driftAnimationDelay": { "type": "range", "min": -3600, "max": 3600 },
"pulseAnimation": { "type": "boolean" },
"pulseAnimationSpeed": { "type": "range", "min": 0.1, "max": 10 },
"pulseAnimationDelay": { "type": "range", "min": -3600, "max": 3600 }
```

A style whose timelines are all unnamed advertises only the first three. Static
styles do not advertise any of them, although the options are accepted (and
ignored) everywhere.

## Initials extraction

The `initial` and `initials` variables are derived from the seed via the
`Initials.fromSeed(seed)` helper:

1. Strip the `@...` suffix so that an email yields a single name (`alice@x` →
   `alice`, not `[alice, x]`).
2. Remove apostrophe-like characters (`` ` ´ ' ʼ ``) so that `O'Neill` is
   treated as one word.
3. Match Unicode letter sequences with `\p{L}[\p{L}\p{M}]*`: each match is one
   "word".
4. **No words found?** Retry once without step 1 (so a seed of just `@bob` still
   yields `B`). If that still returns nothing, the variable resolves to the
   empty string.
5. **One word?** Take the first one or two grapheme-like units (`\p{L}\p{M}*`),
   uppercased.
6. **Multiple words?** Take the first grapheme of the first word and the first
   grapheme of the last word, uppercased.

`initial` is `initials.charAt(0)`, the first code unit of the result, which
matches the first letter for every input the regex produces.

## Testing your implementation

The DiceBear repository ships a language-neutral parity test suite at
[`tests/fixtures/parity/`](https://github.com/dicebear/dicebear/tree/11.x/tests/fixtures/parity).
It is the canonical way to verify a new implementation: the JavaScript, PHP,
Python, Rust, Go, Dart, and C# reference implementations all consume the same
JSON fixtures and assert the same outputs, so any port that reads these fixtures
gets the same coverage for free.

The unit fixtures each pin one contract:

| Fixture           | Pins                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fnv1a.json`      | The 32-bit hash and its 8-char hex form for ASCII input, the `seed:key` patterns produced by `Prng.getValue()`, and Unicode (`„é"`, `„日本語"`, emoji, long strings)                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `mulberry32.json` | The first 5 chained `{nextFloat, state}` pairs per seed, so state progression is checked, not only the first step                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `prng.json`       | Every `Prng` method (`getValue`, `pick`, `weightedPick`, `bool`, `float`, `integer`, `shuffle`) as `{seed, key, args, result}` cases, including order-independence checks for `pick`, `weightedPick`, and `shuffle`                                                                                                                                                                                                                                                                                                                                                                             |
| `numbers.json`    | Number formatting: at most 5 decimal places, halves toward +Infinity, negative half-way boundaries, tiny values that collapse to `0`                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `initials.json`   | Seed-to-initials extraction with accents, quotes, email `@`-stripping, CJK, and emoji                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `colors.json`     | The `Color` helpers (`toHex`, `toRgbHex`, `parseHex`, `luminance`, `sortByContrast`, `filterNotEqualTo`). The luminance entries pin exact doubles, including values around the linearization threshold (see the warning above), and the sort cases include a stability check                                                                                                                                                                                                                                                                                                                    |
| `validation.json` | Accept/reject outcomes for definitions and options (error _messages_ are language-specific and not part of the contract), circular `contrastTo` chains with their resolution path, tag tokens that break the grammar (uppercase segments, a third segment, a double `!`), animation blocks with unordered or duplicate keyframes or unknown tracks, `animation` given a name or a list, `${name}Animation` given a string or an uppercase name, and `animationSpeed`, `${name}AnimationSpeed`, `animationDelay`, and `${name}AnimationDelay` out of range, with too many bounds, or non-numeric |

The remaining fixtures come in threes, one set per style. `styles/{name}.json`
is a vendored copy of the definition. `avatars/{name}.json` holds
`{id, options, svg, resolvedOptions}` cases. `descriptors/{name}.json` is the
`OptionsDescriptor` field map: types, ranges, sorted variant lists, per-color
fields, the `tags` enum where variants carry tags, and the `animation` fields
where the style has timelines.

Every avatar file opens with the same eleven cases: two seeds, size with scale
and rotation, translate with border radius and flip, solid, linear, and radial
backgrounds, fixed color order for user colors and for the palette, and `title`
with and without characters that need escaping. Select cases also carry a
`dataUri` field that pins the percent-encoding contract (JavaScript's
`encodeURIComponent`: every byte except `A-Za-z0-9-_.!~*'()` is escaped). The
cases after those are specific to the style:

| Style         | Covers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `initials`    | Text elements, `fontFamily` and `fontWeight`, a text color with `contrastTo`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `thumbs`      | Four components with per-component transforms, `contrastTo` and `notEqualTo` chains, a user color override, root `attributes`                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `glass`       | Component aliases via `extends`, an authored `defs` element, a probability of zero                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `notionists`  | Eleven components, `notEqualTo` between the ink and paper colors, `gestureVariant`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `shape-grid`  | Sixteen aliases of one component, pinned variants, a probability of zero                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `tagged`      | Variants tagged in several categories next to one untagged component. Every token form of `tags`: allow, bare, `!` disallow, "or" within a category, "and" across categories, unknown category, unknown value, and the precedence of `${name}Variant`                                                                                                                                                                                                                                                                                                                                |
| `animated`    | An opt-in animation component whose variants have `weight: 0` and are reachable only through the `tags` filter                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `declarative` | Every track type, keyword and bezier easings, custom origins, negative delays, finite iterations, named and unnamed timelines, an animated component reference. `animation` off and on, `${name}Animation` switching one name on, two names on, one name off while the rest play, and an unknown name, `animationSpeed` as a factor and as a range, `${name}AnimationSpeed` alone, over a global factor, as a range, for an unknown name, and next to a switched-off name, and `animationDelay` alone, next to a speed, as a range, overridden per name, and for a switched-off name |
| `coexist`     | A declarative timeline next to a tag-gated `<style>` component, each on its own and both together                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### How to use the fixtures

For each fixture entry, your implementation must produce the recorded result
exactly:

```text
fnv1a:      Fnv1a::hash(input)        == entry.hash
            Fnv1a::hex(input)         == entry.hex
mulberry32: m = Mulberry32(seed);
            for each {float, state} in sequence:
              m.nextFloat() == float && m.state() == state
prng:       Prng(seed).<method>(key, args) == result
numbers:    formatNumber(input)       == entry.output
initials:   Initials::fromSeed(seed)  == entry.result
colors:     Color::<method>(args)     == entry.result   (floats bit-exact)
validation: Style/Avatar construction succeeds iff entry.valid;
            circular cases throw with chain == entry.chain
descriptor: OptionsDescriptor(style).toJSON() deep-equals the fixture
avatar:     Avatar(style, options).toString() == svg    (byte-for-byte)
            Avatar(style, options).toDataUri() == dataUri (when present)
```

Start with `fnv1a.json` and `mulberry32.json`. These are pure functions and the
easiest to debug. Once those are green, the `prng.json` cases will tell you
whether your sort order, weighted-pick threshold, and Fisher-Yates loop match.
Only then move on to the avatar fixtures, which compose everything.

The `resolvedOptions` field on each avatar fixture contains only the options
that were actually touched during resolution: unset options (`title`, `size`
when not provided, etc.) do not appear. The JavaScript reference relies on
`JSON.stringify()` dropping `undefined` values at the serialization boundary;
the PHP reference filters `null` values explicitly in `Options::resolved()`, and
the Python reference does the same in `Resolver.resolved()`. All produce the
same shape. A port that returns the full memo map verbatim will fail the
comparison. Strip unset entries before serializing. Key order is not part of the
contract, but a port that compares ordered output should know that the reference
touches the memo in render order: the switches as nodes are met, then for the
animation hash the id suffix and the named timelines in code unit order, where a
playing name without its own factor reads the global speed.

### Regenerating the fixtures

The fixtures are produced from the JavaScript reference implementation:

```bash
npm run fixtures:parity
```

This rewrites every file under `tests/fixtures/parity/` from `@dicebear/core`.
You only need to run this if you have intentionally changed the JS rendering
output and want to update the expected values for every implementation.

### Manual SVG comparison

For ad-hoc spot checks beyond the fixtures, you can also generate reference SVGs
from the CLI and compare byte-for-byte:

```bash
dicebear create initials --seed "Alice" -o ./reference/initials.svg
dicebear create lorelei --seed "Alice" -o ./reference/lorelei.svg
dicebear create avataaars --seed "Alice" -o ./reference/avataaars.svg
```

Start with the `initials` style (simplest) and work up to more complex styles
with multiple components and color constraints.

## Reference implementations

| Language   | Package                               | Source                                                                                     |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| JavaScript | `@dicebear/core`                      | [src/js/core/src/](https://github.com/dicebear/dicebear/tree/11.x/src/js/core/src)         |
| PHP        | `dicebear/core`                       | [src/php/core/src/](https://github.com/dicebear/dicebear/tree/11.x/src/php/core/src)       |
| Python     | `dicebear-core`                       | [src/python/core/src/](https://github.com/dicebear/dicebear/tree/11.x/src/python/core/src) |
| Rust       | `dicebear-core`                       | [src/rust/core/src/](https://github.com/dicebear/dicebear/tree/11.x/src/rust/core/src)     |
| Go         | `github.com/dicebear/dicebear-go/v11` | [src/go/core/](https://github.com/dicebear/dicebear/tree/11.x/src/go/core)                 |
| Dart       | `dicebear_core`                       | [src/dart/core/lib/](https://github.com/dicebear/dicebear/tree/11.x/src/dart/core/lib)     |
| C#         | `DiceBear.Core`                       | [src/csharp/core/src/](https://github.com/dicebear/dicebear/tree/11.x/src/csharp/core/src) |
