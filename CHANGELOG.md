# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [10.4.0] - 2026-08-01

### Changed

- **Styles:** Bumped `@dicebear/styles` to `10.3.0`. The release adds thirteen
  styles: `blobs`, `clay`, `constellation`, `critters`, `landscape`, `loops`,
  `moods`, `pixelbot`, `planets`, `sprouts`, `squircles`, `waves`, and `weave`.
  It also gives `shapes`, `glass`, `thumbs`, `initial-face`, and every new style
  except `weave` an opt-in `animation` component, which stays off until the
  `animationVariant` or `tags` render option turns it on.

## [10.4.0-rc.2] - 2026-07-31

### Fixed

- **Converter:** Raster conversion no longer drops parts of rotated avatars with
  translucent layers. The resvg build that `resvg-js` bundles places the
  isolation layer of an `opacity` group in the wrong coordinate space when the
  group sits under both a `clip-path` and a large rotation, and cuts the group's
  content. The `waves` style lost about half of its image in every raster
  format, including through the HTTP API. Since the viewport crops to the canvas
  anyway, the converter now removes clip paths that cover exactly the canvas
  before it hands the SVG to resvg. A clip with rounded corners is removed as
  well and re-applied to the rendered image, so the `radius` option keeps
  working. Its corners are drawn by sharp instead of resvg as a result, which
  changes their antialiasing slightly.

## [10.4.0-rc.1] - 2026-07-31

### Added

- **Core (all languages):** A new `tags` render option narrows the pool of
  variants an avatar is drawn from. Styles may label their variants with tags
  such as `animation` or `hairLength:long`, and the option keeps or drops
  variants by those labels, so one trait is pinned down while the rest of the
  avatar stays varied. A token is `category` or `category:value`, with a leading
  `!` to exclude. An include keeps the variants carrying a matching tag together
  with those that carry no tag in the category. Several values of one category
  act as "or", different categories act as "and", and an exclude wins over an
  include. A bare `category` token requires the category and drops the variants
  without a tag in it, but only in the components where the category is in use.
  An unknown category is ignored, an unknown value is not: since nothing matches
  it, every variant tagged in that category drops out. A per-component
  `{component}Variant` option is more specific and switches the filter off for
  that component. If a filter leaves a component without a variant, the
  component is not drawn. The option takes a string or an array of strings, and
  in the HTTP API it is the comma-separated `tags` query parameter. Styles that
  carry no tags are unaffected. In the DiceBear styles, tags currently describe
  one thing, the opt-in animation of the animated styles, so `tags=animation`
  turns that animation on at a random speed per seed and `!animation` keeps it
  off. The character categories follow in a later release.
- **Docs:** Two guides cover the new option, "Filter Avatar Variants with Tags"
  for the filter itself and "How DiceBear Tags Variants" for the vocabulary the
  DiceBear styles use. The playground has a tag panel per category, where every
  token is an allow/disallow switch, and its count of unique avatars accounts
  for the filter. Style pages list the tags a style provides and mark every
  variant preview with its own. The core option reference moved out of the
  JavaScript page onto a shared "Core options" page that all six library pages
  link to.
- **CLI:** Definition files can now be compressed in place with
  `dicebear ./my-style.json --optimize`. The flag runs the same svgo pass over
  every element tree that the current Figma exporter applies on export.
  Hand-authored definitions and files from older exporter versions shrink, by up
  to 42% (`pixel-art`), while recent exports come back unchanged.
  `--optimize-check` reports without writing and exits non-zero when the file
  would change, which makes it usable as a CI gate. `--optimize-precision` sets
  the float precision for path and transform data (default 3). Color and
  component references, variables, element ids, CSS classes and `<style>`
  contents are verified after the pass, and the CLI refuses to write the file
  when any of them changed.

### Fixed

- **Core (all languages):** The id suffix for `<defs>` entries now hashes the
  style source name together with the seed. It previously hashed only the seed,
  so two avatars of different styles with the same seed produced identical ids
  for shared component names (`body`, `eyes`, `animation`, `clip`, ...) and
  stole each other's `<defs>` when inlined on one page. Rendered ids change for
  every avatar as a result.
- **Core (all languages):** The generator comment now points at
  `https://www.dicebear.com`. It carried the bare `dicebear.com` host since
  10.3.0, which only redirects to the canonical `www` host that the `<metadata>`
  block already used. The byte output of every avatar changes as a result,
  including data URIs and content hashes, so consumers that compare rendered
  SVGs against stored snapshots need to update them.
- **Docs:** In the playground, clicking "None" in a component's variant picker
  while weights were shown stored an empty weights object, which the core
  rejects — the preview then rendered no avatar at all. An empty selection is
  now stored as an empty list, which renders the avatar without that component.
  Styles that ship non-default weights were affected immediately, because their
  pickers open in weights mode.

## [10.3.2] - 2026-07-29

### Fixed

- **Converter:** Raster conversion no longer alters text content. The XML round
  trip that sets the output size trimmed whitespace and converted
  numeric-looking text, so `<text>0123</text>` rendered as `123` and `1e3` as
  `1000` in every raster format, including through the HTTP API. Text nodes and
  CDATA sections now survive the round trip unchanged. Previously the converter
  unwrapped a CDATA section into raw text, which could turn a valid SVG into
  ill-formed XML.
- **Converter:** Raster conversion now accepts SVGs nested deeper than 100
  elements. The XML parser's default nesting cap made `toPng()` and friends
  throw on valid documents that resvg renders fine. The cap is now 1024 levels.
- **Converter:** The converter now reads `mask-type` declarations the way a
  browser does. It strips a trailing `!important` instead of copying it into the
  presentation attribute, where resvg would reject the value and silently fall
  back to `luminance`. It ignores invalid values, and when a `style` attribute
  repeats the declaration, the last valid one wins.

### Changed

- **Converter:** `normalizeMaskType()` now works on the parsed XML tree instead
  of rewriting the markup with regular expressions, and the raster entry points
  apply it in the same parser pass that sets the output size. Input that needs
  no fix comes back byte-identical. So does input the XML parser cannot read,
  where the old version attempted a partial rewrite. When a mask does need
  fixing, the function re-emits the SVG from the parsed tree, which can
  normalize formatting details such as quote style or self-closing tags and
  drops a `<!DOCTYPE>` declaration. The rendered image stays the same.
- **Converter:** The XML serializer moved from the deprecated `XMLBuilder`
  export of `fast-xml-parser` to its successor package `fast-xml-builder`. The
  output is byte-identical. The only visible change for consumers is the new
  package in the dependency tree.

## [10.3.1] - 2026-07-27

### Fixed

- **Converter:** Masks that declare `mask-type: alpha` in a `style` attribute
  now rasterize correctly. resvg reads `mask-type` only as a presentation
  attribute, and without one it falls back to the `luminance` default, which
  turns a mask drawn in black into a mask that hides its subject. Seven styles
  ship such masks: `bottts-neutral`, `disco`, `glyphs`, `lorelei`, `micah`,
  `personas` and `toon-head`. On `lorelei` a bearded avatar lost its mouth in
  the PNG while the SVG rendered fine. The HTTP API converts through this
  package and was affected the same way. The normalization is also exported as
  `normalizeMaskType()` for callers that drive resvg directly.

## [10.3.0] - 2026-06-13

### Added

- **Core:** Every rendered SVG now starts with the generator comment
  `<!-- Generated by DiceBear (https://dicebear.com) -->` as the first child of
  the root `<svg>` element. The comment is byte-identical across the JavaScript,
  PHP, Python, Rust, Go, and Dart libraries. The byte output of every avatar
  changes as a result, including data URIs and content hashes, so consumers that
  compare rendered SVGs against stored snapshots need to update them. SVG
  optimizers that strip comments (e.g. SVGO with default settings) remove it
  again.
- **Dart library:** A new Dart implementation (the
  [`dicebear_core`](https://pub.dev/packages/dicebear_core) package) that
  produces identical output to the JavaScript library when given the same styles
  and options. It validates style definitions and options against the shared
  schemas (via `dicebear_schema`) and pairs with the `dicebear_styles` package.
- **Core (PHP, Python):** Added `Style::fromJson()` (PHP) and
  `Style.from_json()` (Python) to build a style from a raw JSON string without a
  separate `json_decode(..., true)` / `json.loads(...)` call. Malformed JSON
  raises the language's native parse error (`JsonException` /
  `json.JSONDecodeError`); an invalid definition raises the usual
  `StyleValidationError`. Mirrors `Style::from_str` (Rust) and `Style.parse`
  (Dart); the existing array/dict constructor is unchanged.

### Deprecated

- **Core (JS, PHP, Python):** Passing a raw style definition to `Avatar` is
  deprecated; pass a `Style` instead
  (`new Avatar(new Style(definition), options)`), which also lets you reuse one
  parsed style across many avatars. The definition still works for now and
  renders identically, but emits a deprecation warning (a one-time
  `console.warn` in JS, `E_USER_DEPRECATED` in PHP, `DeprecationWarning` in
  Python) and will be removed in v11. The Dart, Rust and Go libraries already
  require a `Style`, so this brings every port to the same `Avatar(style, …)`
  call.

## [10.2.0] - 2026-06-10

### Added

- **Go library:** A new Go implementation (the
  `github.com/dicebear/dicebear-go/v10` module) that produces identical output
  to the JavaScript library when given the same styles and options.

### Fixed

- **Core:** `Color.luminance()` now derives the sRGB linearization from a
  precomputed lookup table (one entry per 8-bit channel value) instead of
  calling `pow` at runtime. `pow` is not required to be correctly rounded and
  produced last-ULP differences between JS engines (V8 vs. others), the C math
  library (PHP, Python, Rust), and Go's pure-Go implementation, so luminance
  values, and in contrived cases contrast-based color ordering, could diverge
  across languages and even across browsers. The table holds the values the
  JavaScript reference produces today, so JavaScript output is unchanged; the
  other libraries move by at most one ULP. The Go library additionally forces
  intermediate rounding in the weighted sum, which the compiler could otherwise
  fuse into FMA instructions on arm64. Rendered SVGs are unaffected.
- **Core (PHP):** `Avatar::toDataUri()` now percent-encodes exactly like
  JavaScript's `encodeURIComponent`. Previously the PHP library used plain
  `rawurlencode`, which additionally escapes `!*'()`, characters that occur in
  every rendered SVG (e.g. `url(#…)` references and `translate(…)` transforms),
  so the data URI diverged byte-wise from the JavaScript, Python, Rust, and Go
  libraries. The decoded SVG was unaffected.
- **Core (JS):** The `initial` style variable now resolves to the full first
  code point of the initials. Previously the JavaScript library emitted a lone
  UTF-16 surrogate (ill-formed XML) when the initials started with a character
  outside the Basic Multilingual Plane (e.g. an emoji). The PHP, Python, Rust,
  and Go libraries already returned the full character; all libraries are now
  byte-identical for such seeds.
- **Core (Rust):** `Avatar.to_json()` now records `size` before `title` in the
  resolved-options snapshot, matching the JavaScript, PHP, and Python libraries.
  The rendered SVG was unaffected; only consumers comparing or hashing the
  serialized options JSON across languages were affected.
- **Core (Python):** `Avatar.to_json()` now serializes whole-number floats in
  the resolved-options snapshot as integers (`1`, not `1.0`), matching the
  JavaScript, Rust, and PHP libraries. Previously snapshot values such as
  `scale`, `rotate`, `translateX`/`translateY`, `borderRadius`, color angles,
  and per-component transforms were emitted as `1.0`/`0.0`, so the serialized
  JSON diverged from the other ports. The rendered SVG was unaffected. The
  values were already numerically equal, so only consumers comparing or hashing
  the serialized options JSON across languages were affected.

## [10.2.0-rc.1] - 2026-06-07

### Added

- **Rust library:** A new Rust implementation (the `dicebear-core` crate) that
  produces identical output to the JavaScript library when given the same styles
  and options.

### Fixed

- **Core:** Initials now discard everything from the first `@` to the end of the
  seed (e.g. an email domain). Previously the strip stopped at the first line
  terminator (at a line feed in PHP and Python, and additionally at a carriage
  return or `U+2028`/`U+2029` in JavaScript), so a seed with a line break after
  the `@` kept the trailing text as a second word, and the libraries could even
  diverge from each other. All language libraries now produce byte-identical
  initials for such seeds.

## [10.1.0] - 2026-06-06

### Changed

- **Schema:** Bumped the bundled `@dicebear/schema` to `1.1.0` across the
  JavaScript, PHP, and Python libraries. It adds an upper bound of `1000000` to
  the canvas and component `width`/`height`, preventing the language ports'
  number-to-string formatting from diverging at extreme values. Official styles
  use ~100, so no real avatar is affected.
- **Styles:** Bumped `@dicebear/styles` to `10.1.0`. Lorelei's mouth is now
  visible through `beard` variants (the overlaying mask was previously rendered
  at `0` opacity), and all style definitions now reference
  `@dicebear/schema@1.1.0`.

## [10.1.0-rc.1] - 2026-06-02

### Added

- **Python library:** A new Python implementation that produces identical output
  to the JavaScript library when given the same styles and options.

## [10.0.2] - 2026-06-02

### Fixed

- **Core:** Numeric values in rendered SVGs are now consistently rounded to at
  most 5 decimal places, so the JavaScript and PHP libraries produce
  byte-identical output for every input. Previously, fractional or very
  small/large values (e.g. a fractional `borderRadius` or `translateX`,
  component transforms, or gradient stop offsets) could be stringified
  differently between languages (scientific notation, differing precision).
  Avatars built from whole-number options are unaffected.
- **Core (PHP):** `Prng::float` now rounds halves toward +Infinity (matching the
  JavaScript reference's `Math.round`) instead of PHP's native `round()`, which
  rounds halves away from zero. The two diverged for negative values landing
  exactly on a `.5` boundary, so a PHP-rendered avatar could differ from the
  JavaScript one by `0.0001` in a rotate/translate transform or color angle for
  certain seeds. Output is now byte-identical across languages.
- **Core (PHP):** Initials are now derived correctly from seeds containing
  multibyte letters such as `ü` or `ô`. The quote-stripping step was missing the
  `/u` (Unicode) flag, so it removed raw UTF-8 bytes and corrupted those
  letters: e.g. `über` and `côté` produced wrong or empty initials instead of
  `ÜB` / `CÔ`. The PHP output now matches the JavaScript reference.
- **Core:** Range options (`scale`, `borderRadius`, `rotate`,
  `translateX`/`translateY`, and per-color angle/fill-stops) given as a
  single-element array `[n]` are now treated as the fixed value `n` (identical
  to the scalar `n`), and an empty array `[]` falls back to the option's
  default. Both forms are permitted by the schema. Previously the behavior
  diverged: the JavaScript library emitted `NaN` (e.g. `scale(NaN)`), while PHP
  dropped `[n]` to the default. All three now agree.

## [10.0.1] - 2026-05-29

### Fixed

- **CLI:** `dicebear --version` and `dicebear --help` no longer fail by trying
  to read a file named `--version`/`--help`. The definition path is now resolved
  via the argument parser, so flags (and the values they consume) before the
  path are handled correctly, e.g. `dicebear --json my-style.json` and
  `dicebear --count 2 my-style.json`.

## [10.0.0] - 2026-05-27

See the
[v10.0.0 release notes](https://github.com/dicebear/dicebear/releases/tag/v10.0.0).

### Added

- **6 new avatar styles:** Disco, Glyphs, Initial Face, Shape Grid, Stripes, and
  Triangles.
- **PHP library:** A new PHP implementation that produces identical output to
  the JavaScript library when given the same styles and options.
- **CLI support for custom styles:** Generate avatars from a JSON style
  definition, e.g. `dicebear ./path/to/style.json --seed test --format svg`.
- **Weighted variants:** Assign weights to component variants to control how
  frequently each appears.
- **Gradient support:** Colors can be defined as gradients, including an angle
  parameter.
- **Integrated validation:** Built-in validation for avatar styles and options.
- **Redesigned playground:** Adjust options, upload custom styles, batch
  download avatars, and view the number of possible combinations.
- **New tools:** WCAG Contrast Picker and Bundle Size Estimator.
- Reorganized and improved documentation, with better style docs and component
  previews.

### Changed

- Each avatar style is now stored as a JSON definition file instead of
  JavaScript code, separating licensing concerns from implementation.
- Styles are now distributed via `@dicebear/styles` as JSON definitions.
- The JavaScript API now uses `Style` and `Avatar` classes together with
  definition imports.
- **BREAKING:** Component options are now suffixed with `Variant` (e.g.
  `eyesVariant` instead of `eyes`).

### Removed

- **BREAKING:** Individual style packages (e.g. `@dicebear/initials`) have been
  removed in favor of `@dicebear/styles`.

[Unreleased]: https://github.com/dicebear/dicebear/compare/v10.4.0...HEAD
[10.4.0]: https://github.com/dicebear/dicebear/compare/v10.4.0-rc.2...v10.4.0
[10.4.0-rc.2]:
  https://github.com/dicebear/dicebear/compare/v10.4.0-rc.1...v10.4.0-rc.2
[10.4.0-rc.1]:
  https://github.com/dicebear/dicebear/compare/v10.3.2...v10.4.0-rc.1
[10.3.2]: https://github.com/dicebear/dicebear/compare/v10.3.1...v10.3.2
[10.3.1]: https://github.com/dicebear/dicebear/compare/v10.3.0...v10.3.1
[10.3.0]: https://github.com/dicebear/dicebear/compare/v10.2.0...v10.3.0
[10.2.0]: https://github.com/dicebear/dicebear/compare/v10.2.0-rc.1...v10.2.0
[10.2.0-rc.1]:
  https://github.com/dicebear/dicebear/compare/v10.1.0...v10.2.0-rc.1
[10.1.0]: https://github.com/dicebear/dicebear/compare/v10.1.0-rc.1...v10.1.0
[10.1.0-rc.1]:
  https://github.com/dicebear/dicebear/compare/v10.0.2...v10.1.0-rc.1
[10.0.2]: https://github.com/dicebear/dicebear/compare/v10.0.1...v10.0.2
[10.0.1]: https://github.com/dicebear/dicebear/compare/v10.0.0...v10.0.1
[10.0.0]: https://github.com/dicebear/dicebear/releases/tag/v10.0.0
