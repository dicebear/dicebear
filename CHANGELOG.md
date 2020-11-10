# Changelog

## [4.4.0] - 2020-11-11

### Added

- `@dicebear/avatars-avataaars-sprites` New option values for `facialHair`: `pastel` and `gray`
- `@dicebear/avatars-avataaars-sprites` New option value for `eyebrow`: `frown`
- `@dicebear/avatars-avataaars-sprites` New option `accessoriesColor`

### Changed

- `@dicebear/avatars-avataaars-sprites` Completely rewritten to remove the `react`, `react-dom` and `avataaars` dependencies. Solves [#48](https://github.com/DiceBear/avatars/issues/48).

## [4.3.0] - 2020-11-06

### Fixed

- Text position was wrong in `@dicebear/avatars-initials-sprites` when a font size was specified.

### Removed

- Code sprites are no longer supported. Too CPU intensive for the HTTP API and does not fit into the future vision of the next major release. Use [qr-image](https://www.npmjs.com/package/qr-image) directly instead.

## [4.2.4] - 2020-07-22

### Fixed

- Types for array options in `avatars-avataaars-sprites`

## [4.2.2] - 2020-07-21

### Fixed

- Type for `topChance` in `avatars-avataaars-sprites`

## [4.2.1] - 2020-06-20

### Changed

- Renamed default branch to `v4`.

## [4.2.0] - 2020-05-26

### Changed

- [#73][7] Update seedrandom package to 3.0.5

[7]: https://github.com/DiceBear/avatars/pull/73

## [4.1.1] - 2020-05-14

### Changed

- New API Path. `/api/` instead of `/v2/`

### Fixed

- `initials` more precisely centered
- `avataaars` Background Color

## [4.1.0] - 2020-05-09

### Added

- [#55][1] Aliases for `width`, `height`, `radius`, `background` and `margin`, to keep the URLs of the HTTP API shorter
- [#66][5] `deterministic` for `gridy` avatars. (thanks to @elierotenberg)
- This changelog

### Changed

- [#55][1] Parameter key for the HTTP API flattened. It is now no longer necessary to nest the values in an `options` object.
- [#61][6] Update `topChange` to `topChance`, clarify some documentation (thanks to @pennstatephil)
- [Configurator][2] now always generates the smallest possible HTTP-API URL.
- Reorganized dependencies in the repository.
- Stackpath CDN configured for HTTP API. Saves 90% traffic to Cloudflare Workers and therefore also unnecessary costs. Unfortunately makes the initial call a bit slower.

### Fixed

- [#69][3] Initial avatars were displayed incorrectly in Firefox. Same solution implemented for all browsers.
- [#58][4] Value `0` did not work for chance options in `bottts`.

### Removed

- `bowser` dependency in initials avatars.

[1]: https://github.com/DiceBear/avatars/issues/55
[2]: https://avatars.dicebear.com
[3]: https://github.com/DiceBear/avatars/issues/69
[4]: https://github.com/DiceBear/avatars/issues/58
[5]: https://github.com/DiceBear/avatars/pull/66
[6]: https://github.com/DiceBear/avatars/pull/61
