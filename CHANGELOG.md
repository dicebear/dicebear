# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Core:** Numeric values in rendered SVGs are now consistently rounded to at
  most 5 decimal places, so the JavaScript and PHP libraries produce
  byte-identical output for every input. Previously, fractional or very
  small/large values — e.g. a fractional `borderRadius` or `translateX`,
  component transforms, or gradient stop offsets — could be stringified
  differently between languages (scientific notation, differing precision).
  Avatars built from whole-number options are unaffected.

## [10.0.1] - 2026-05-29

### Fixed

- **CLI:** `dicebear --version` and `dicebear --help` no longer fail by trying
  to read a file named `--version`/`--help`. The definition path is now resolved
  via the argument parser, so flags (and the values they consume) before the
  path are handled correctly — e.g. `dicebear --json my-style.json` and
  `dicebear --count 2 my-style.json`.

## [10.0.0] - 2026-05-27

See the [v10.0.0 release notes](https://github.com/dicebear/dicebear/releases/tag/v10.0.0).

### Added

- **6 new avatar styles:** Disco, Glyphs, Initial Face, Shape Grid, Stripes, and
  Triangles.
- **PHP library:** A new PHP implementation that produces identical output to the
  JavaScript library when given the same styles and options.
- **CLI support for custom styles:** Generate avatars from a JSON style
  definition, e.g. `dicebear ./path/to/style.json --seed test --format svg`.
- **Weighted variants:** Assign weights to component variants to control how
  frequently each appears.
- **Gradient support:** Colors can be defined as gradients, including an angle
  parameter.
- **Integrated validation:** Built-in validation for avatar styles and options.
- **Redesigned playground:** Adjust options, upload custom styles, batch download
  avatars, and view the number of possible combinations.
- **New tools:** WCAG Contrast Picker and Bundle Size Estimator.
- Reorganized and improved documentation, with better style docs and component
  previews.

### Changed

- Each avatar style is now stored as a JSON definition file instead of
  JavaScript code, separating licensing concerns from implementation.
- Styles are now distributed via `@dicebear/styles` as JSON definitions.
- The JavaScript API now uses `Style` and `Avatar` classes together with
  definition imports.
- **BREAKING:** Component options are now suffixed with `Variant`
  (e.g. `eyesVariant` instead of `eyes`).

### Removed

- **BREAKING:** Individual style packages (e.g. `@dicebear/initials`) have been
  removed in favor of `@dicebear/styles`.

[Unreleased]: https://github.com/dicebear/dicebear/compare/v10.0.1...HEAD
[10.0.1]: https://github.com/dicebear/dicebear/compare/v10.0.0...v10.0.1
[10.0.0]: https://github.com/dicebear/dicebear/releases/tag/v10.0.0
