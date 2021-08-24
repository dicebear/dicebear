# Changelog

## [4.7.3] - 2021-08-25

### Added

- `dicebear-project` Cli to create new dicebear avatar styles

### Changed

- `dicebear` Moved cli to mono repository

### Deprecated

- `dicebear` project commands are deprecated. Use new `dicebear-project` cli instead.

## [4.7.2] - 2021-08-05

### Fixed

- `dicebear` Fixed dependency management

## [4.7.1] - 2021-08-02

### Fixed

- `dicebear` missing files in package

## [4.7.0] - 2021-08-02

### Added

- `esm`, `cjs` and `umd` bundles for all packages.
- New package `@dicebear/collection` to install all official avatar styles at once.
- New CLI `dicebear` to create avatars and build avatar styles.

### Changed

#### @dicebear/avatars-bottts-sprites

- No longer uses the deprecated `Color` class.

### Fixed

- Error `ReferenceError: Can't find variable: exports` in svelte. See
  [#123](https://github.com/dicebear/dicebear/issues/123)
- File sizes reduced by automatically removing unnecessary whitespaces from template strings.

## [4.6.10] - 2021-07-31

### Fixed

- `@dicebear/avatars-avataaars-sprites` Avataaars clotheGraphics doesn't work #135

## [4.6.10] - 2021-07-31

### Fixed

- `@dicebear/avatars-avataaars-sprites` Avataaars clotheGraphics doesn't work #135

## [4.6.9] - 2021-06-23

### Fixed

- `@dicebear/micah` Fixed `facialHair` / `mouth` contrast #132

## [4.6.8] - 2021-06-23

### Fixed

- Reference error #123

## [4.6.7] - 2021-06-23

### Fixed

- `@dicebear/avatars` Aliases from styles were not noticed

### Added

- `@dicebear/micah` `eyeShadowColor` option as a better name for `eyeColor` #130

### Deprecated

- `@dicebear/micah` `eyeColor` option => use `eyeShadowColor` instead #130

## [4.6.6] - 2021-06-23

### Fixed

- `@dicebear/micah` the `dougFunny` hair style is always black #131

## [4.6.5] - 2021-06-22

### Fixed

- `@dicebear/micah` A filter is no longer applied to a color palette with only one color.

## [4.6.4] - 2021-05-16

### Fixed

- `@dicebear/avatars` Regular expressions optimized

## [4.6.3] - 2021-04-23

### Fixed

- `@dicebear/avatars` peer dependency fixed - again

## [4.6.2] - 2021-04-21

### Fixed

- `@dicebear/avatars` peer dependency fixed

## [4.6.1] - 2021-04-20

No notable changes.

## [4.6.0] - 2021-04-18

### Added

- New API based on functions instead of classes in preparation for version 5.0

  Old API

  ```js
  import Avatars from `@dicebear/avatars`;
  import style from `@dicebear/avatars-identicon-sprites`;

  let options = {};
  let seed = 'custom-seed';
  let avatars = new Avatars(style, options);
  let svg = avatars.create(seed);
  ```

  New API

  ```js
  import { createAvatar } from `@dicebear/avatars`;
  import * as style from `@dicebear/avatars-identicon-sprites`;

  let svg = createAvatar(style, {
    seed: 'custom-seed',
    // ... and other options
  });
  ```

- JSON Schema added to each avatar style. Used for API, Types and upcoming features.

- Metadata in generated avatars with author and license information.

#### @dicebear/avatars

- New Option `backgroundColor`

#### @dicebear/micah

- New avatar style based on the "Avatar Illustration System" by Micah Lanier.  
  https://www.figma.com/community/file/829741575478342595

#### @dicebear/avatars-avataaars-sprites

- New option values for `accessoriesColor`, `clotheColor` and `hatColor`:

  - `blue01`
  - `blue02`
  - `blue03`
  - `gray01`
  - `gray02`
  - `pastelBlue`
  - `pastelGreen`
  - `pastelOrange`
  - `pastelRed`
  - `pastelYellow`

- New option `clotheGraphic`

- New option values for `clothes`:

  - `blazerAndShirt`
  - `blazerAndSweater`
  - `collarAndSweater`
  - `graphicShirt`
  - `shirtCrewNeck`
  - `shirtScoopNeck`
  - `shirtVNeck`

- New option values for `eyebrows`:

  - `angryNatural`
  - `defaultNatural`
  - `flatNatural`
  - `raisedExcited`
  - `raisedExcitedNatural`
  - `sadConcerned`
  - `sadConcernedNatural`
  - `unibrowNatural`
  - `upDown`
  - `upDownNatural`
  - `frownNatural`

- New option values for `eyes`:

  - `closed`
  - `xDizzy`
  - `eyeRoll`

- New option values for `facialHairColor` and `hairColor`:

  - `blondeGolden`
  - `brownDark`
  - `pastelPink`
  - `silverGray`

- New option values for `facialHair`:

  - `beardMedium`
  - `beardLight`
  - `beardMagestic`
  - `moustaceFancy`
  - `moustacheMagnum`

- New option values for `mouth`:

  - `screamOpen`

- New option values for `top`:

  - `bigHair`
  - `bob`
  - `bun`
  - `curly`
  - `curvy`
  - `dreads`
  - `frida`
  - `fro`
  - `froAndBand`
  - `miaWallace`
  - `longButNotTooLong`
  - `shavedSides`
  - `straight01`
  - `straight02`
  - `straightAndStrand`
  - `dreads01`
  - `dreads02`
  - `frizzle`
  - `shaggy`
  - `shaggyMullet`
  - `shortCurly`
  - `shortFlat`
  - `shortRound`
  - `shortWaved`
  - `sides`
  - `theCaesar`
  - `theCaesarAndSidePart`
  - `hat`
  - `winterHat01`
  - `winterHat02`
  - `winterHat03`
  - `winterHat04`

### Changed

- Dependency `svgson` updated to version 5.2
- Removed style `isolation:isolate` in all avatar styles

### Deprecated

- Default exports are deprecated. Use new function based API instead. (See "Added")

#### @dicebear/avatars

- Color class is deprecated and will be removed with version 5.0.
- Parser class is deprecated and will be removed with version 5.0.
- Option `background` is deprecated. Use `backgroundColor` instead.

#### @dicebear/avatars-avataaars-sprites

- Some `accessoriesColor` and `clotheColor` values are deprecated:

  - `blue` => use `blue01`, `blue02` and `blue03` instead
  - `gray` => use `gray01` and `gray02` instead
  - `pastel` => use `pastelBlue`, `pastelGreen`, `pastelOrange`, `pastelRed` and `pastelYellow` instead

- Some `clothes` values are deprecated:

  - `blazer` => use `blazerAndShirt` and `blazerAndSweater` instead
  - `sweater` => use `collarAndSweater` instead
  - `shirt` => use `graphicShirt`, `shirtCrewNeck`, `shirtScoopNeck` and `shirtVNeck` instead

- Some `eyebrow` values are deprecated:

  - `flat` => use `flatNatural` instead
  - `raised` => use `raisedExcited` and `raisedExcitedNatural` instead
  - `sad` => use `sadConcerned` and `sadConcernedNatural` instead
  - `unibrow` => use `unibrowNatural` instead
  - `up` => use `upDown` and `upDownNatural` instead
  - `frown` => use `frownNatural` instead

- Some `eyes` values are deprecated:

  - `close` => use `closed` instead
  - `dizzy` => use `xDizzy` instead
  - `roll` => use `eyeRoll` instead

- Some `facialHairColor` and `hairColor` values are deprecated:

  - `pastel` => use `pastelPink` instead
  - `gray` => use `silverGray` instead

- Some `facialHair` values are deprecated:

  - `medium` => use `beardMedium` instead
  - `light` => use `beardLight` instead
  - `majestic` => use `beardMajestic` instead
  - `fancy` => use `moustaceFancy` instead
  - `magnum` => use `moustacheMagnum` instead

- Some `mouth` values are deprecated:

  - `scream` => use `screamOpen` instead

- Option `mode` is deprecated.

- Some `top` values are deprecated:

  - `longHair` => use `bigHair`, `bob`, `bun`, `curly`, `curvy`, `dreads`, `frida`, `fro`, `froAndBand`, `miaWallace`,
    `longButNotTooLong`, `shavedSides`, `straight01`, `straight02` and `straightAndStrand` instead
  - `shortHair` => use
    `dreads01`,`dreads02`,`frizzle`,`shaggy`,`shaggyMullet`,`shortCurly`,`shortFlat`,`shortRound`,`shortWaved`,`sides`,`theCaesar`
    and `theCaesarAndSidePart` instead

#### @dicebear/avatars-gridy-sprites

- Change `deterministic` default to `true`.

### Removed

#### @dicebear/avatars

- Removed unused webpack build. We will completely switch to microbundle with version 5 and also support CDNs like
  unpkg.

## [4.5.4] - 2021-02-24

### Fixed

- `@dicebear/avatars` Type for `b` option.

## [4.5.3] - 2021-01-25

### Fixed

- `@dicebear/avatars-avataaars-sprites` Removed unnecessary white background.

## [4.5.2] - 2020-12-14

### Fixed

- `@dicebear/avatars-avataaars-sprites` Background color was not used

## [4.5.1] - 2020-12-07

### Fixed

- `@dicebear/avatars` Randomness increased in new PRNG implementation

## [4.5.0] - 2020-12-06

### Added

- `@dicebear/avatars` Option `dataUri` as replacement for `base64`.

### Changed

- `@dicebear/avatars` Package `seedrandom` replaced with own PRNG implementation.

### Deprecated

- `@dicebear/avatars` Option `base64` is now deprecated. Use `dataUri` instead.

## [4.4.1] - 2020-11-21

### Removed

- `@dicebear/avatars-avataaars-sprites` Graphic shirt "selena"

## [4.4.0] - 2020-11-11

### Added

- `@dicebear/avatars-avataaars-sprites` New option values for `facialHair`: `pastel` and `gray`
- `@dicebear/avatars-avataaars-sprites` New option value for `eyebrow`: `frown`
- `@dicebear/avatars-avataaars-sprites` New option `accessoriesColor`

### Changed

- `@dicebear/avatars-avataaars-sprites` Completely rewritten to remove the `react`, `react-dom` and `avataaars`
  dependencies. Solves [#48](https://github.com/DiceBear/avatars/issues/48).

## [4.3.0] - 2020-11-06

### Fixed

- Text position was wrong in `@dicebear/avatars-initials-sprites` when a font size was specified.

### Removed

- Code sprites are no longer supported. Too CPU intensive for the HTTP API and does not fit into the future vision of
  the next major release. Use [qr-image](https://www.npmjs.com/package/qr-image) directly instead.

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

- [#55][1] Parameter key for the HTTP API flattened. It is now no longer necessary to nest the values in an `options`
  object.
- [#61][6] Update `topChange` to `topChance`, clarify some documentation (thanks to @pennstatephil)
- [Configurator][2] now always generates the smallest possible HTTP-API URL.
- Reorganized dependencies in the repository.
- Stackpath CDN configured for HTTP API. Saves 90% traffic to Cloudflare Workers and therefore also unnecessary costs.
  Unfortunately makes the initial call a bit slower.

### Fixed

- [#69][3] Initial avatars were displayed incorrectly in Firefox. Same solution implemented for all browsers.
- [#58][4] Value `0` did not work for chance options in `bottts`.

### Removed

- `bowser` dependency in initials avatars.

[1]: https://github.com/DiceBear/avatars/issues/55
[2]: https://dicebear.com
[3]: https://github.com/DiceBear/avatars/issues/69
[4]: https://github.com/DiceBear/avatars/issues/58
[5]: https://github.com/DiceBear/avatars/pull/66
[6]: https://github.com/DiceBear/avatars/pull/61
