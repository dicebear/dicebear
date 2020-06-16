# [5.0.0] - TBA

## Changed

### General

- NPM namespace and package names changed to separate them from libraries not belonging to "DiceBear Avatars". In addition "sprite collections" are now called "avatar styles". This results in the following name changes:
  - `@dicebear/avatars` => `@avatars/core`
  - `@dicebear/avatars-avataaars-sprites` => `@avatars/avataaars`
  - `@dicebear/avatars-bottts-sprites` => `@avatars/bottts`
  - `@dicebear/avatars-code-sprites` => `@avatars/code`
  - `@dicebear/avatars-female-sprites` => `@avatars/pixel-art`
  - `@dicebear/avatars-gridy-sprites` => `@avatars/gridy`
  - `@dicebear/avatars-human-sprites` => `@avatars/pixel-art`
  - `@dicebear/avatars-identicon-sprites` => `@avatars/identicon`
  - `@dicebear/avatars-initials-sprites` => `@avatars/initials`
  - `@dicebear/avatars-jdenticon-sprites` => `@avatars/jdenticon`
  - `@dicebear/avatars-male-sprites` => `@avatars/pixel-art`
- Deprecation of packages with the old namespace.

### @avatars/core

- Classes are rewritten as functions. This change allows direct access to the `create` function without having to initialize an object first.

  Old API

  ```js
    import Avatars from `@dicebear/avatars`;
    import spriteCollection from `@dicebear/avatars-identicon-sprites`;

    let options = {};
    let seed = 'custom-seed';
    let avatars = new Avatars(spriteCollection, options);
    let svg = avatars.create(seed);
  ```

  New API

  ```js
    import * as avatars from `@avatars/core`;
    import avatarsStyle from `@avatars/identicon`;

    let options = {};
    let seed = 'custom-seed';
    let svg = avatars.create(avatarsStyle, seed, options);
  ```

- If no `seed` is passed, a random one is defined. Example usage:

  ```js
    import * as avatars from `@avatars/core`;
    import avatarsStyle from `@avatars/identicon`;

    let options = {};
    let seed = undefined;
    let svg = avatars.create(avatarsStyle, seed, options);
  ```

### @avatars/avataaars

- The following options have been renamed
  - `topChance` => `topProbability`
  - `accessoriesChance` => `accessoriesProbability`
  - `facialHairChance` => `facialHairProbability`
  - `skin` => `skinColor`
  - `eyebrow` => `eyebrows`
  - `clothes` => `clothing` - To be closer to the names in the Sketch library.
  - `clothesColor` => `clothingColor` - To be closer to the names in the Sketch library.
- Renamed the following possible values of the `eyebrows` option:
  - `flat` => `flatNatural`
  - `unibrow` => `unibrowNatural`
- Renamed the following possible values of the `clothes` option:
  - `sweater` => `collarAndSweater`

### @avatars/bottts

- The following options have been renamed
  - `mouthChance` => `mouthProbability`
  - `sidesChance` => `sidesProbability`
  - `textureChance` => `textureProbability`
  - `topChance` => `topProbability`

### @avatars/jdenticon

- Options are adapted to those of the 'jdenticon' library. This results in the following changes:
  - `colorLightness` => `lightnessColor`
  - `grayscaleLightness` => `lightnessGrayscale`
  - `colorSaturation` => `saturationColor`
  - `grayscaleSaturation` => `saturationGrayscale`

## Fixed

### @avatars/core

- [#68](8) base64 option on nodejs environments

## Added

### @avatars/avataaars

- New possible values for `eyebrows` option:
  - `frownNatural`
  - `angryNatural`
  - `defaultNatural`
  - `raisedExcited`
  - `raisedExcitedNatural`
  - `sadConcerned`
  - `sadConcernedNatural`
  - `upDown`
  - `upDownNatural`
  - `flatNatural`
- New possible values for `clothes` option:
  - `blazerAndShirt`
  - `blazerAndSweater`
  - `graphicShirt`
  - `shirtCrewNeck`
  - `shirtScoopNeck`
  - `shirtVNeck`
- New possible values for `clothingColor` option:
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

### @avatars/pixel-art

- Added as a merger for `male`, `female` and `human`.
- The following options are new:
  - `skinColor` (See [#68](10))
  - `maleMustacheProbability`
  - `maleGlassesProbability`
  - `maleHairProbability`
  - `maleHatProbability`
  - `femaleAccessoriesProbability`
  - `femaleGlassesProbability`
  - `femaleHatProbability`

## Removed

### @avatars/core

- Color modifier classes. Moved to `@avatars/pixel-art`.
- Material colors. Use [material-colors](9) package instead.
- Option `userAgent`.

### @avatars/avataaars

- The followig values of the `clothes` option are removed:
  - `blazer` - use `blazerAndShirt` and `blazerAndSweater` instead.
  - `shirt` - use `graphicShirt`, `shirtCrewNeck`, `shirtScoopNeck` and `shirtVNeck` instead.
- The followig values of the `eyebrows` option are removed:
  - `raised` - use `raisedExcited` and `raisedExcitedNatural` instead.
  - `sad` - use `sadConcerned` and `sadConcernedNatural` instead.
  - `up` - use `upDown` and `upDownNatural` instead.
- The followig values of the `clothingColor` option are removed:
  - `blue` - use `blue01`, `blue02` and `blue03` instead.
  - `gray` - use `gray01` and `gray02` instead.
  - `pastel` - use `pastelBlue`, `pastelGreen`, `pastelOrange`, `pastelRed` and `pastelYellow` instead.

[8]: https://github.com/DiceBear/avatars/issues/68
[9]: https://www.npmjs.com/package/material-colors
[10]: https://github.com/DiceBear/avatars/issues/53

# [4.2.0] - 2020-05-26

## Changed

- [#73][7] Update seedrandom package to 3.0.5

[7]: https://github.com/DiceBear/avatars/pull/73

# [4.1.1] - 2020-05-14

## Changed

- New API Path. `/api/` instead of `/v2/`

## Fixed

- `initials` more precisely centered
- `avataaars` Background Color

# [4.1.0] - 2020-05-09

## Changed

- [#55][1] Parameter key for the HTTP API flattened. It is now no longer necessary to nest the values in an `options` object.
- [#61][6] Update `topChange` to `topChance`, clarify some documentation (thanks to @pennstatephil)
- [Configurator][2] now always generates the smallest possible HTTP-API URL.
- Reorganized dependencies in the repository.
- Stackpath CDN configured for HTTP API. Saves 90% traffic to Cloudflare Workers and therefore also unnecessary costs. Unfortunately makes the initial call a bit slower.

## Fixed

- [#69][3] Initial avatars were displayed incorrectly in Firefox. Same solution implemented for all browsers.
- [#58][4] Value `0` did not work for chance options in `bottts`.

## Added

- [#55][1] Aliases for `width`, `height`, `radius`, `background` and `margin`, to keep the URLs of the HTTP API shorter
- [#66][5] `deterministic` for `gridy` avatars. (thanks to @elierotenberg)
- This changelog

## Removed

- `bowser` dependency in initials avatars.

[1]: https://github.com/DiceBear/avatars/issues/55
[2]: https://avatars.dicebear.com
[3]: https://github.com/DiceBear/avatars/issues/69
[4]: https://github.com/DiceBear/avatars/issues/58
[5]: https://github.com/DiceBear/avatars/pull/66
[6]: https://github.com/DiceBear/avatars/pull/61
