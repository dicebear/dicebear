# DiceBear 8.0 - Release Notes

## Fixes

### @dicebear/core

- #394: Different background colours for the same options between browsers.
- No random background colour if background type "solid" and only two colours are specified.

### @dicebear/croodles

- URL to the homepage of vijay verma updated.

### @dicebear/croodles-neutral

- URL to the homepage of vijay verma updated.

## Added

### @dicebear/core

- Color util tests

### @dicebear/croodles

- New option `glassesColor`
- New option `eyepatchColor`

### @dicebear/croodles-neutral

- New option `glassesColor`
- New option `eyepatchColor`

## Breaking Changes

### dicebear (CLI)

- To create an avatar, the new `create` command must be used.

  ```bash
  # With version 7 and below
  dicebear <style> [output]
  
  # With version 8 and above
  dicebear create <style> [output]
  ```
