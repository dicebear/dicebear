# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- **Core (JS, PHP, Python):** `Avatar` no longer accepts a raw style definition,
  deprecated since 10.1. Pass a `Style`:
  `new Avatar(new Style(definition), options)`. JS throws a `TypeError`, PHP and
  Python reject the argument by type.

### Changed

- **Styles:** Bumped `@dicebear/styles` to `11.0.0-rc.2` for the docs. The
  definitions reference `@dicebear/schema` 2.0.1.
- **Core (Go):** The module path is `github.com/dicebear/dicebear-go/v11`, as Go
  requires for the new major version. `11.0.0-rc.1` still carried `/v10` and was
  not fetchable as a Go module. The release script and the workspace tests now
  check the path against the version before a tag is created.
- **Core:** All seven cores require `@dicebear/schema` 2.0, which carries the
  animation options and the boolean `animation`. The Go module imports
  `github.com/dicebear/schema/v2`.
- **Core:** `*ColorOrder: 'fixed'` treats the style's palette the way it treats
  user colors, as announced in 10.5: the palette is used in its definition
  order, duplicates included, the contrast sort is skipped, and the gradient
  stop count defaults to the number of colors. The deduplicated, code-point
  sorted fallback is gone from all seven cores.
- **Core:** `animation` is a boolean. The name and list forms from 11.0.0-rc.1
  are gone, a single animation is switched through its `${name}Animation` option
  instead.
- **Core:** All seven cores require `@dicebear/schema` 2.0.2, which rejects
  `animations` below `defs` and `clipPath` and on elements a group cannot wrap,
  such as `stop`, `tspan` and the filter primitives. The wrappers the renderer
  adds never reach a `<use>` instance and are no valid clipPath content, so such
  an animation played nowhere and could hide the clipped content. Animations
  below `mask` stay allowed.
- **Core:** The renderer reads an element's animation switches once, after its
  children rendered. The resolved options of an avatar no longer depend on
  whether a pruned wrapper carried an `opacity` attribute.

### Added

- **Core:** A switch and a speed per animation, in all seven cores.
  `blinkAnimation: true` plays the `blink` timelines alone, `animation: true`
  with `blinkAnimation: false` plays everything but them, and
  `blinkAnimationSpeed: 2` sets their pace, as a factor or a range the seed
  picks from. Each named option wins over its global counterpart. The options
  descriptor lists one switch and one speed field per animation name.
- **Core:** `animationDelay` and `${name}AnimationDelay` shift the start of the
  animations by seconds, added after the speed applies. As a range such as
  `[0, 5]` every seed starts at its own moment, so a wall of avatars no longer
  blinks in unison.

## [11.0.0-rc.1] - 2026-09-01

### Added

- **Core:** All seven cores render the declarative animations of
  `@dicebear/schema` 1.6. The new `animation` option is off by default, `true`
  plays every timeline of a style, and a name or a list of names plays only
  those. `animationSpeed` scales the pace, as a factor or as a range the seed
  picks from. With the option off the SVG stays byte-identical to before, so
  raster output and the HTTP API remain static. The CSS respects
  `prefers-reduced-motion`, and the options descriptor lists both options only
  for styles that carry animations.

- **CLI:** `--optimize` rebuilds circles and ellipses that an editor exported as
  paths, and keeps `animations` blocks intact.

- **Docs:** The playground has an animation section, and the guide for
  implementing a core covers the tag filter and the animation rendering.

### Changed

- **Editor:** Exports stay static, so the `animation` option is hidden.

## [10.7.0] - 2026-08-26

### Changed

- **Styles:** Bumped `@dicebear/styles` to `10.6.0` for the CLI, the docs, and
  the editor. The release adds `cameo`, `gaze`, `marbles`, `shadows`, `slice`,
  and `stack`, which take the collection from 55 to 61 styles. `gaze` is
  animated, which takes that count from 18 to 19. Each of the six has a style
  page with its own preview row and a preset gallery, and the four the docs list
  under Characters are in the editor too.

- **Editor:** Option labels can now differ per style. They are one flat map per
  language, because an option key almost always means the same thing wherever it
  appears. German was the exception: it gave the head and the piece sitting on
  top of it the same word, "Kopf", in `bottts` and `croodles`, which put two
  identical tabs in one strip, while English and Portuguese already told the two
  apart. A style that needs a different word now overrides that one label under
  `styles.<styleName>` in the message file, and only the language that deviates
  carries an override. `marbles` and `cameo` took one too, for a highlight that
  German and Portuguese called a flower and for a body color on a style that
  draws no body. `npm run validate:messages` now fails the build on a missing
  label, on two keys resolving to the same word inside one style, and on an
  override whose key or style is gone.

### Fixed

- **Core (C#):** Validation and rendering now agree with the other cores in
  several places where 10.7.0-rc.1 did not. Schema patterns are rewritten before
  they are compiled, because .NET reads `$` as matching before a trailing
  newline and narrows `\s` to ASCII, which let a trailing newline through every
  anchored pattern and let non-ASCII whitespace past the `javascript:` and
  `url()` filters. A seed or title holding an unpaired surrogate keeps it
  instead of becoming U+FFFD, which used to produce a different avatar. The JSON
  envelope writes supplementary-plane characters literally. `Avatar.FromJson`
  rejects JSON that is not an object. A component that references itself raises
  `CircularComponentReferenceException` instead of overflowing the stack.

  The color helpers are no longer public. `DiceBear.Color` collided with
  `Godot.Color`, `UnityEngine.Color` and `System.Drawing.Color`, so a file with
  `using DiceBear;` stopped compiling. This is a breaking change for anyone on
  10.7.0-rc.1 who called them.

## [10.7.0-rc.1] - 2026-08-22

### Added

- **Core:** A C# port, published to NuGet as `DiceBear.Core`. It renders SVG
  byte-identical to the JavaScript reference and the PHP, Python, Rust, Go, and
  Dart ports, and runs the shared parity fixtures to prove it. The package
  targets `netstandard2.0` and `net8.0`, which covers .NET 8 and newer, .NET
  Framework 4.6.1 and newer, Unity, and Godot 4.2+ with .NET. Godot was the
  reason it exists: its two scripting languages are GDScript and C#, and until
  now a Godot game could only reach DiceBear over the network. The schemas come
  from the new `DiceBear.Schema` package and are validated with JsonSchema.Net.

  Two things needed extra care to keep the output identical. The invariant
  culture only applies simple case mappings, so `ß` would stay `ß` where the
  reference writes `SS`, and the port carries the full JavaScript uppercase
  table instead. `Math.Round` rounds halves to even, so the number formatter
  compares the fractional part against 0.5 the way `Math.round` does.

  The docs gained a C# library page, and the style pages, the playground and the
  guides all carry C# snippets now. The style definitions come from the new
  `DiceBear.Styles` package.

## [10.6.1] - 2026-08-18

### Fixed

- **Core (all languages):** Avatars no longer carry empty wrapper elements. An
  optional component that came up empty left its wrapper behind, and in
  `notionists` that wrapper sits inside a mask. A masked group without content
  has no bounding box, and AndroidSVG takes the mask size from that box, so the
  whole file fails to render. Gallery apps on Android showed such avatars as
  corrupted while browsers drew them fine. Every file reported as broken has
  such a wrapper, and the working ones from the same download do not. A wrapper
  is now left out when nothing inside it renders, unless it carries an id that
  something may point at. `bottts-neutral`, `clay`, `critters`, `notionists`,
  and `squircles` were affected, `bottts-neutral` in about half of all seeds.
  The rendered image does not change.

## [10.6.0] - 2026-08-16

### Added

- **Core:** Color fields in `OptionsDescriptor` now carry `notEqualTo`, the list
  of color groups a group must differ from, next to the existing `contrastTo`,
  in all six core implementations (JavaScript, PHP, Python, Rust, Go, and Dart).
  Tooling that picks colors itself needs both constraints, because one explicit
  color per group leaves the renderer nothing to sort or filter. The descriptor
  parity fixtures and the guide on accessing all available options cover the new
  property.

### Changed

- **Styles:** Bumped `@dicebear/styles` to `10.5.0` for the CLI, the docs, and
  the editor. The release adds `cutouts`, `line-face` and `patchwork`, which
  take the collection from 52 to 55 styles, and exposes the dark color nine
  existing styles draw with as a color group: `inkColor` on seven of them,
  `outlineColor` on `lorelei`, and `strokeColor` on `toon-head`. The CLI was
  still on `^10.4.0`, a range that never matched the prerelease, so it had been
  shipping 52 definitions while the docs and the editor were already on 55.

### Fixed

- **Editor:** Shuffle drew every color on its own and ignored the `contrastTo`
  and `notEqualTo` constraints from the style definition. In `thumbs` that gave
  the shape the background color in about one of five shuffles, where it then
  vanished, and picked the worse of black and white for eyes and mouth about
  half the time. `clay`, `critters`, `micah`, `voxel-art`, and `voxel-bot` were
  affected too. Shuffle now resolves colors in dependency order and applies the
  same constraints as the renderer.

## [10.5.0] - 2026-08-09

### Added

- **Core:** New per-color option `*ColorOrder` with the values `random` and
  `fixed`, in all six core implementations (JavaScript, PHP, Python, Rust, Go,
  and Dart). `random` is the previous behavior: the PRNG shuffles the colors
  before use. With `fixed`, colors passed via `*Color` keep exactly the given
  order; gradient fills apply them as stops from first to last, solid fills
  always use the first color, and the number of gradient stops defaults to the
  number of given colors. Without user-supplied colors, `fixed` only skips the
  shuffle and uses the style's palette in sorted order; `contrastTo` and
  `notEqualTo` constraints still apply, so referenced color groups can keep the
  result seed-dependent. Existing avatars are unaffected, since `random` stays
  the default. Requested in discussion
  [#549](https://github.com/orgs/dicebear/discussions/549) for building
  gradients with a fixed color sequence, such as flag colors. `@dicebear/schema`
  1.4.0 validates the option, and two new parity fixture cases per style pin its
  behavior across the ports. The core options guide and the implementation
  specification cover the details.
- **Docs:** Style pages for `voxel-art` and `voxel-bot`, the two styles new in
  `@dicebear/styles` 10.4.0. The animated-avatars page now fills its style count
  from the definitions at build time, through the same token mechanism the
  overall count already uses; the hardcoded number it replaces had gone stale
  at 15.
- **Editor:** The eight character styles the editor was missing: `clay`,
  `critters`, `moods`, `pixelbot`, `sprouts`, `thumbs`, `voxel-art`, and
  `voxel-bot`. Its style list now matches the docs' Characters category exactly,
  and the new option labels are translated into English, German, and Portuguese.
  The animation option stays hidden in the editor, since its export writes
  static files; an avatar without an explicit `animationVariant` never animates,
  because every animated variant carries weight 0.

### Changed

- **Core (JavaScript):** The schema validators are now generated with
  [`@exodus/schemasafe`](https://github.com/ExodusMovement/schemasafe) instead
  of Ajv. The published package still has no runtime dependencies, and the
  validator code shrinks from 164 KB to 114 KB minified, so browser bundles of
  `@dicebear/core` shrink by the same amount. Both compilers accept and reject
  the same inputs: every published style definition and a set of deliberately
  broken samples produced identical verdicts. Error messages change, however.
  schemasafe reports JSON pointers without prose, so the message is now derived
  from the failing keyword (`/size is smaller than allowed`), and every
  `ValidationErrorDetail` carries two new optional fields, `schemaPath` and
  `keyword`, that name the schema rule behind a failure. When an object violates
  a named property and a pattern property at the same time, the error list only
  reports the first group; the verdict is not affected.
- **CLI:** Removed the unused `ajv` dependency, which makes a CLI install about
  2.7 MB smaller.
- **Converter:** The browser build no longer bundles an XML parser. Setting the
  render size and mirroring `mask-type` declarations now run on the native
  `DOMParser` and `XMLSerializer`, which every browser ships. The XML dependency
  stack (fast-xml-parser and friends) made up nine tenths of the browser bundle;
  it stays in the Node build, where no native XML machinery exists. A browser
  bundle of `@dicebear/converter` shrinks from 26 kB to 1.4 kB gzipped. Two
  edges change with the parser: a malformed SVG now fails with a clear error
  instead of a parser-specific one, and when `normalizeMaskType` rewrites a
  document in the browser, empty elements come back self-closing. Both helpers
  are covered by new jsdom-based tests.
- **Styles:** Bumped `@dicebear/styles` to `10.4.0` for the CLI, the docs, and
  the editor. The release adds `voxel-art` and `voxel-bot`, which take the
  collection from 50 to 52 styles. Both ship the opt-in `animation` component,
  so 18 of the 52 styles can now animate.

### Deprecated

- **Core:** The sorted fallback order that `*ColorOrder: 'fixed'` applies when
  no `*Color` option is set. In DiceBear 10, this case deduplicates and
  code-point sorts the style palette, so palettes keep their canonical order and
  only the shuffle is skipped. DiceBear 11 will use the palette in its
  definition order instead, the same verbatim rule that already applies to
  user-supplied colors. That removes the user-colors/palette distinction from
  the resolvers and makes `fixed` mean the same thing for both sources. The sort
  site in each of the six ports carries a matching deprecation comment.

### Fixed

- **Docs:** The bundle size estimator now reports what a bundler actually ships:
  one minified bundle per package, gzipped as a whole. It previously gzipped
  every published file on its own without minification, which showed
  `@dicebear/core` at 58 kB instead of 26 kB and `@dicebear/converter` at 8 kB
  instead of 26 kB, since the converter's browser build pulls its XML
  dependencies into the bundle. The converter hint also claimed PDF output; the
  package converts to PNG, JPEG, WebP, and AVIF.

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

[Unreleased]: https://github.com/dicebear/dicebear/compare/v11.0.0-rc.1...HEAD
[11.0.0-rc.1]:
  https://github.com/dicebear/dicebear/compare/v10.7.0...v11.0.0-rc.1
[10.7.0]: https://github.com/dicebear/dicebear/compare/v10.7.0-rc.1...v10.7.0
[10.7.0-rc.1]:
  https://github.com/dicebear/dicebear/compare/v10.6.1...v10.7.0-rc.1
[10.6.1]: https://github.com/dicebear/dicebear/compare/v10.6.0...v10.6.1
[10.6.0]: https://github.com/dicebear/dicebear/compare/v10.5.0...v10.6.0
[10.5.0]: https://github.com/dicebear/dicebear/compare/v10.4.0...v10.5.0
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
