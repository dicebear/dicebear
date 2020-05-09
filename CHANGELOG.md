# Changelog

## [5.0.0] - TBA

### Added

### Changed

- NPM namespace and package names changed to distinguish them from libraries not belonging to "DiceBear Avatars". In addition "sprite collections" are now called "avatar styles". This results in the following name changes:
  - @dicebear/avatars => @avatars/core
  - @dicebear/avatars-avataaars-sprites => @avatars/avataaars
  - @dicebear/avatars-bottts-sprites => @avatars/bottts
  - @dicebear/avatars-code-sprites => @avatars/code
  - @dicebear/avatars-female-sprites => @avatars/female
  - @dicebear/avatars-gridy-sprites => @avatars/gridy
  - @dicebear/avatars-human-sprites => @avatars/human
  - @dicebear/avatars-identicon-sprites => @avatars/identicon
  - @dicebear/avatars-initials-sprites => @avatars/initials
  - @dicebear/avatars-jdenticon-sprites => @avatars/jdenticon
  - @dicebear/avatars-male-sprites => @avatars/male
- Deprecation of packets with the old namespace.

### Fixed

### Removed


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
