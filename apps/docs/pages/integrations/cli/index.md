---
title: CLI – Generate Avatars from the Command Line
description: >
  Generate avatars in bulk with the DiceBear CLI. Free command-line avatar
  generator for creating profile pictures and user placeholder images. All
  styles supported.
---

# CLI

The CLI prints a single avatar to the terminal, writes large numbers of avatars
in one run, compresses definition files, and compares two versions of a style.

## Installation

You need [Node.js](https://nodejs.org/en/) (version 22 or higher) and npm.

```sh
npm install dicebear --global
```

Run the same command again to update to the latest version with the newest
avatar styles. `dicebear --help` lists all commands.

## Create avatars

### Print an avatar

Replace `<style>` with an avatar style name (lowercase, with hyphens for
multi-word styles, e.g. `lorelei`, `pixel-art`, `adventurer-neutral`).
`dicebear create --help` lists every built-in style.

```sh
dicebear create <style>
```

Without an output path the avatar goes to stdout, so this prints one SVG of the
[lorelei](/styles/lorelei/) style:

```sh
dicebear create lorelei --seed "Alice"
```

Pipe it wherever you need it. The license banner with the style's creator and
license goes to stderr, so it never ends up in the file:

```sh
dicebear create lorelei --seed "Alice" > alice.svg
dicebear create lorelei --seed "Alice" --format png | pbcopy
```

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

### Write a file

`-o` (or `--output`) names the file to write. The extension picks the format:

```sh
dicebear create lorelei --seed "Alice" -o ./alice.png
```

The CLI creates missing directories on the way, but it never overwrites a file.
If the file already exists, it stops with an error.

### Create multiple avatars

Point `-o` at a directory and add `--count`:

```sh
dicebear create lorelei -o ./avatars --count 100
```

The files are named `{style}-{index}.{format}`, with the index starting at 0, so
this creates `lorelei-0.svg` to `lorelei-99.svg`. Any path without a known
extension counts as a directory, and more than one avatar always needs one.

With a `--count` above `1`, every avatar gets a random seed and the `--seed`
option has no effect.

### Output formats

`--format` sets the format when there is no extension to take it from, and
`--format png > file` works for stdout as well:

| Format | Description                        |
| ------ | ---------------------------------- |
| `svg`  | Scalable Vector Graphics (default) |
| `png`  | PNG image                          |
| `jpg`  | JPEG image                         |
| `jpeg` | JPEG image (alias for jpg)         |
| `webp` | WebP image                         |
| `avif` | AVIF image                         |
| `json` | JSON with avatar metadata          |

```sh
dicebear create lorelei -o ./avatars --count 10 --format png
```

An extension that contradicts `--format` is an error.

`--size` sets the width and height in pixels for every format. The default is
`512`, and raster formats are capped at `2048`:

```sh
dicebear create lorelei --format png --size 256 > alice.png
```

`--exif` adds Exif metadata to PNG, JPEG, WebP, and AVIF images:

```sh
dicebear create lorelei -o ./avatars --format png --exif
```

In directory mode, `--json` saves a JSON file with the avatar metadata next to
each image, `lorelei-0.json` next to `lorelei-0.png`. For the metadata of a
single avatar, use `--format json` instead.

```sh
dicebear create lorelei -o ./avatars --count 10 --format png --json
```

### Passing style options

Each avatar style has its own options. `--help` after the style name lists all
of them:

```sh
dicebear create lorelei --help
```

List options take a comma-separated value or repeated flags:

```sh
dicebear create lorelei --backgroundColor b6e3f4,c0aede,d1d4f9 --size 128
dicebear create lorelei --backgroundColor b6e3f4 --backgroundColor c0aede
```

## Custom styles

Any JSON [definition file](/create-styles/definition-schema/) works as a style,
including your own and styles exported from
[DiceBear Studio](/create-styles/with-figma/). Pass its path instead of a style
name. The CLI reads the available options from the definition, so `--help` shows
them as well:

```sh
dicebear create ./my-style.json -o ./avatars --count 20 --format png
dicebear create ./my-style.json --help
```

## Compress a definition file

Definition files exported from [DiceBear Studio](/create-styles/with-figma/) are
compressed on export. A definition you wrote or edited by hand is not, and its
path data usually has a lot of room left. `optimize` runs the same
[svgo](https://github.com/svg/svgo) pass over every element tree in the file.
Without an output path the result goes to stdout:

```sh
dicebear optimize ./my-style.json > ./my-style.min.json
```

`-o` writes it to a file instead. Pointing `-o` at the source file rewrites it
in place, and a size report goes to the terminal:

```sh
dicebear optimize ./my-style.json -o ./my-style.json
```

```text
  my-style.json   25.5 KB -> 22.1 KB (-12.8%)
```

Several definitions need a directory. Each file keeps its name, so this rewrites
a whole source tree in place:

```sh
dicebear optimize ./src/*.json -o ./src
```

`--precision` sets how many decimals path and transform data keep. The default
is `3`. Lower values compress harder at the cost of accuracy:

```sh
dicebear optimize ./my-style.json -o ./my-style.json --precision 1
```

`--check` reports whether the files are optimized without writing anything, and
exits with a non-zero status if one is not, which is what you want in continuous
integration:

```sh
dicebear optimize ./src/*.json --check
```

Colors, component references, dynamic values, element ids, CSS classes and the
contents of `<style>` elements all survive unchanged, and component `width` and
`height` are never touched. The CLI verifies this on every run and refuses to
write the file if anything moved, so an optimized definition renders the same
avatars as before.

Built-in styles have no definition file of their own and cannot be optimized.

## Compare two versions of a style

`compare` tells you whether a new version of a style still renders like the old
one. Pass the earlier definition first:

```sh
dicebear compare ./lorelei-v1.json ./lorelei.json
```

Two directories work too. Files are paired by name, and `.min.json` counts as
`.json`, so the package build of every style can be checked against a source
tree in one call:

```sh
dicebear compare ./node_modules/@dicebear/styles/dist ./src
```

For every pair the CLI runs three checks:

1. The definitions are compared on everything apart from the element trees:
   canvas size, meta, animation names, components with their probabilities and
   ranges, variants with their weights and tags, and palettes with their values,
   order and constraints.
2. A number of seeds (`--seeds`, default `20`) is rendered with default options
   on both sides.
3. Every variant that exists on both sides is rendered on its own, with every
   other component and color pinned, so the variant's own change is the only
   thing that can differ.

The renders are compared pixel by pixel, not by markup, so an optimized, a
re-exported, and a hand-edited file can all pass as long as they render the same
avatar. The result is a table with one row per style and a detail block for
every style that changed:

```text
Style      Seeds   Variants   Components   Colors       Result
lorelei    2/20    1/133      +0 -1 ~1     +0 -0 ~1     changed
bottts     0/20    0/53       -            -            identical

lorelei
  variant "beard/variant02": removed
  component "earrings": probability 10 -> 42
  color "earrings": values +#123456 -#000000
  seed "seed-1": 0.57% of pixels differ
  seed "seed-4": 0.52% of pixels differ
  variant "eyebrows/variant01": 6.02% of pixels differ
```

The `Seeds` and `Variants` columns count the renders that differ, the
`Components` and `Colors` columns count added, removed and changed entries. The
exit code is non-zero when anything differs, so the command can guard a release.

### Tolerance

A re-export often moves a path by a fraction of a pixel. `--tolerance` sets the
share of pixels, in percent, a render may differ by before it is reported:

```sh
dicebear compare ./before ./after --tolerance 0.5
```

`--threshold` sets how different two pixels must be to count, from `0` (strict)
to `1` (lenient), and `--size` the render size in pixels (default `128`).

### Diff images

`-o` writes the before, after and diff images of every reported render into a
directory, one folder per style:

```sh
dicebear compare ./before ./after -o ./diff
```

```text
diff/lorelei/eyebrows-variant01.before.png
diff/lorelei/eyebrows-variant01.after.png
diff/lorelei/eyebrows-variant01.diff.png
```

### JSON output

`--json` prints the whole report as JSON for other tools:

```sh
dicebear compare ./before ./after --json
```

:::info

Text styles such as `initials` render their text only with `--system-fonts`,
which loads the fonts of your system for every render and slows the run down.
Without it, the text is left out on both sides and everything else is still
compared.

:::
