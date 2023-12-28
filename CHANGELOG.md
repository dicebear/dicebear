# DiceBear 8.0 - Release Notes

## Fixes

### @dicebear/core

- #394: Different background colours for the same options between browsers.
- No random background colour if background type "solid" and only two colours are specified.

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

### @dicebear/croodles

- New option `glassesColor`
- New option `eyepatchColor`

### @dicebear/croodles-neutral

- New option `glassesColor`
- New option `eyepatchColor`

## Improved

### @dicebear/core

- Simplified integration of copyright information in the metadata of the generated avatars.
    - Copyright information is omitted if designer "Florian Körner" (maintainer of the project)
    - Removed reference to DiceBear in meta information.

## Breaking Changes

### dicebear (CLI)

- To create an avatar, the new `create` command must be used.

  ```bash
  # With version 7 and below
  dicebear <style> [output]
  
  # With version 8 and above
  dicebear create <style> [output]
  ```
