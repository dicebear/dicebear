# DiceBear 8.0 - Release Notes

## Fixes

### @dicebear/core

- #394: Different background colours for the same options between browsers.
- No random background colour if background type "solid" and only two colours
  are specified.

### @dicebear/croodles

- URL to the homepage of vijay verma updated.

### @dicebear/croodles-neutral

- URL to the homepage of vijay verma updated.

### @dicebear/lorelei

- Fix URL to License and Figma file.

### @dicebear/lorelei-neutral

- Fix URL to License and Figma file.

### @dicebear/avataaars

- Fix hardcoded color for `eyepatch`.

## Added

### @dicebear/core

- Color util tests

### @dicebear/converter

- New option `fonts` to specify custom fonts.

### @dicebear/croodles

- New option `glassesColor`
- New option `eyepatchColor`

### @dicebear/croodles-neutral

- New option `glassesColor`
- New option `eyepatchColor`

## Improved

### @dicebear/converter

- Exif data is automatically detected from the SVG and no longer needs to be set
  in options.
- Peer dependencies are now hard dependencies, which makes setup much easier.
  This is made possible by the fact that this package is no longer a hard
  dependency of "@dicebear/core".

## @dicebear/cli

- Exif data is now enabled by default. Disable with `--includeExif false`.

### @dicebear/core

- Simplified integration of copyright information in the metadata of the
  generated avatars.
  - Copyright information is omitted if designer "Florian Körner" (maintainer of
    the project)
  - Removed reference to DiceBear in meta information.

### @dicebear/converter

- In NodeJS, the system fonts are loaded instead of the Inter Font as long as no
  other fonts are specified via the options. This also allows characters that
  are outside the character set of the Inter Font.

## Breaking Changes

### dicebear (CLI)

- To create an avatar, the new `create` command must be used.

  ```bash
  # With version 7 and below
  dicebear <style> [output]

  # With version 8 and above
  dicebear create <style> [output]
  ```

### @dicebear/core

- Removed the export of the `license` utility.
- The `toDataUri` method is now synchronous and the `toDataUriSync` method has
  been removed.
- The methods `png`, `jpg`, `toArrayBuffer`, `toFile` have been removed. For a
  conversion to `png` and `jpg` the `@dicebear/converter` package must be
  installed separately.

### @dicebear/initials

- Option `fontWeight` removed.

### @dicebear/converter

- No longer provides methods for converting SVG to SVG.
- No longer exports the 'toFormat' function. Use the methods `toPng` and
  `toJpeg` instead.
- Method `toFile` removed.
