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

Make sure you have [Node.js](https://nodejs.org/en/) (version 22 or higher) and
npm installed.

```
npm install dicebear --global
```

## Upgrade

For the latest features and avatar styles, make sure you update the CLI
regularly.

```
npm install dicebear --global
```

## Create avatars

### Print an avatar

Replace `<style>` with an avatar style name (lowercase, kebab-case for
multi-word styles, e.g. `lorelei`, `pixel-art`, `adventurer-neutral`).

```
dicebear create <style>
```

Without an output path the avatar goes to stdout. So this prints one SVG for the
[lorelei](/styles/lorelei/) style:

```
dicebear create lorelei --seed "Alice"
```

Pipe it wherever you need it. The license banner goes to stderr, so it never
ends up in the file:

```
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

```
dicebear create lorelei --seed "Alice" -o ./alice.png
```

The CLI does not overwrite existing files. It creates missing directories on the
way.

### Create multiple avatars

Point `-o` at a directory and add `--count`:

```
dicebear create lorelei -o ./avatars --count 100
```

This generates `lorelei-0.svg`, `lorelei-1.svg`, ..., `lorelei-99.svg`. Any path
without a known extension is treated as a directory. More than one avatar always
needs a directory.

:::warning

The `seed` option has no effect in combination with the `count` option. If
`count` is greater than `1`, random values are generated and used as `seed` to
make the avatars differ from each other.

:::

:::tip Performance

The CLI uses parallel processing based on your CPU cores, so large batches of
avatars generate quickly.

:::

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

```
dicebear create lorelei -o ./avatars --count 10 --format png
```

An extension that contradicts `--format` is an error.

#### Controlling the output image size

`--size` controls the output dimensions (width and height in pixels) for all
formats. The default is `512`. For rasterized formats (PNG, JPEG, WebP, AVIF)
the value is capped at `2048`.

```
dicebear create lorelei --format png --size 256 > alice.png
```

#### Adding Exif metadata

When creating PNG, JPEG, WebP, or AVIF images, you can include Exif metadata:

```
dicebear create lorelei -o ./avatars --format png --exif
```

#### Saving JSON alongside images

In directory mode, `--json` saves a JSON file with avatar metadata next to each
image:

```
dicebear create lorelei -o ./avatars --count 10 --format png --json
```

This creates both `lorelei-0.png` and `lorelei-0.json` for each avatar. To print
the metadata of a single avatar use `--format json` instead.

### Passing style options

Each avatar style has its own customization options. To see all available
options for a specific style, use `--help`:

```
dicebear create lorelei --help
```

Example output:

```
dicebear create <style>

Create avatars from a built-in style or a definition file

Options:
      --help                           Show help                       [boolean]
      --version                        Show version number             [boolean]
  -o, --output                         Write to this file, or into this
                                       directory with --count. Without it the
                                       avatar goes to stdout.           [string]
      --count                          How many avatars to create. More than one
                                       needs --output <dir>.
                                                           [number] [default: 1]
      --format                         Output format. Defaults to the --output
                                       extension, else svg.
         [string] [choices: "svg", "png", "jpg", "jpeg", "webp", "avif", "json"]
      --exif                           Include Exif metadata in raster formats
                                                      [boolean] [default: false]
      --json                           Save a JSON file next to each image
                                       (needs --output <dir>)
                                                      [boolean] [default: false]
      --seed                                                            [string]
      --size                                                            [number]
      --flip         [array] [choices: "none", "horizontal", "vertical", "both"]
      --rotate                                                          [string]
      --scale                                                           [string]
      --borderRadius                                                    [string]
      --backgroundColor                                                  [array]
      ... (style-specific options)
```

List options take a comma-separated value or repeated flags:

```
dicebear create lorelei --backgroundColor b6e3f4,c0aede,d1d4f9 --size 128
dicebear create lorelei --backgroundColor b6e3f4 --backgroundColor c0aede
```

### Output file naming

In directory mode, files are named using the pattern `{style}-{index}.{format}`:

- `lorelei-0.svg`
- `lorelei-1.png`
- `avataaars-0.webp`

The index starts at 0 and increments for each avatar created.

:::warning File overwrite protection

The CLI will **not** overwrite existing files. If a file already exists at the
target path, an error will be thrown. Make sure to use an empty directory or
remove existing files before generating new avatars.

:::

### License banner

Before generating avatars, the CLI displays a license banner with information
about the style's creator and license. The banner goes to stderr, so it never
mixes with an avatar printed to stdout.

```
----------------------------------------------------------------
Lorelei by Lisa Wischofsky
Homepage: https://www.instagram.com/lischi_art/
Source: https://www.figma.com/community/file/1198749693280469639
License: CC0 1.0 - https://creativecommons.org/publicdomain/zero/1.0/
----------------------------------------------------------------
```

### Show help

For general help and the list of commands:

```
dicebear --help
```

```
dicebear <command>

Commands:
  dicebear create <style>            Create avatars from a built-in style or a
                                     definition file
  dicebear optimize <definition...>  Compress definition files with svgo
  dicebear compare <before> <after>  Compare two versions of a style, or two
                                     directories of styles

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

`dicebear create --help` lists every built-in style.

## Custom styles

You can use any JSON [definition file](/create-styles/definition-schema/) as a
style, including your own custom styles or styles exported from
[DiceBear Studio](/create-styles/with-figma/).

Just pass the path to the JSON file instead of a style name:

```
dicebear create ./my-style.json -o ./avatars
```

All available options are automatically detected from the definition. Use
`--help` to see them:

```
dicebear create ./my-style.json --help
```

Generate multiple avatars in PNG format:

```
dicebear create ./my-style.json -o ./avatars --count 20 --format png
```

## Compress a definition file

Definition files exported from [DiceBear Studio](/create-styles/with-figma/) are
already compressed on export. A definition you wrote or edited by hand is not,
and its path data usually has a lot of room left. `optimize` runs the same
[svgo](https://github.com/svg/svgo) pass over every element tree in the file.
Without an output path the result goes to stdout:

```
dicebear optimize ./my-style.json > ./my-style.min.json
```

`-o` writes it to a file instead. Pointing `-o` at the source file rewrites it
in place, and a size report goes to the terminal:

```
dicebear optimize ./my-style.json -o ./my-style.json
```

```
  my-style.json   25.5 KB -> 22.1 KB (-12.8%)
```

Several definitions need a directory. Each file keeps its name, so this rewrites
a whole source tree in place:

```
dicebear optimize ./src/*.json -o ./src
```

Use `--precision` to control how many decimals path and transform data keep. The
default is `3`. Lower values compress harder at the cost of accuracy:

```
dicebear optimize ./my-style.json -o ./my-style.json --precision 1
```

`--check` reports whether the files are optimized without writing anything, and
exits with a non-zero status if one is not. This is what you want in continuous
integration:

```
dicebear optimize ./src/*.json --check
```

Colors, component references, dynamic values, element ids, CSS classes and the
contents of `<style>` elements all survive unchanged, and component `width` and
`height` are never touched. The CLI verifies this on every run and refuses to
write the file if anything moved, so an optimized definition renders the same
avatars as before.

:::info

Built-in styles have no definition file of their own and cannot be optimized.

:::

## Compare two versions of a style

`compare` tells you whether a new version of a style still renders like the old
one. Pass the earlier definition first:

```
dicebear compare ./lorelei-v1.json ./lorelei.json
```

Two directories work too. Files are paired by name, and `.min.json` counts as
`.json`, so the package build of every style can be checked against a source
tree in one call:

```
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

The renders are compared pixel by pixel. The result is a table with one row per
style and a detail block for every style that changed:

```
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

The comparison is about pixels, not markup. Two definitions may produce
different SVG and still pass, which is the point: an optimized file, a
re-exported file and a hand-edited file can all render the same avatar.

### Tolerance

A re-export often moves a path by a fraction of a pixel. `--tolerance` sets the
share of pixels, in percent, a render may differ by before it is reported:

```
dicebear compare ./before ./after --tolerance 0.5
```

`--threshold` sets how different two pixels must be to count, from `0` (strict)
to `1` (lenient), and `--size` the render size in pixels (default `128`).

### Diff images

`-o` writes the before, after and diff images of every reported render into a
directory, one folder per style:

```
dicebear compare ./before ./after -o ./diff
```

```
diff/lorelei/eyebrows-variant01.before.png
diff/lorelei/eyebrows-variant01.after.png
diff/lorelei/eyebrows-variant01.diff.png
```

### JSON output

`--json` prints the whole report as JSON for other tools:

```
dicebear compare ./before ./after --json
```

:::info

Text styles such as `initials` render their text only with `--system-fonts`,
which loads the fonts of your system for every render and slows the run down.
Without it, the text is left out on both sides and everything else is still
compared.

:::

## Troubleshooting

### "File already exists" error

`create` does not overwrite existing files. Either:

- Use an empty output directory
- Delete existing files before generating new avatars

### Avatar style not found

Style names are lowercase, with hyphens for multi-word styles (e.g. `pixel-art`,
`adventurer-neutral`). Run `dicebear create --help` to see all available styles.

### Permission denied

Make sure you have write permissions to the output directory. On Unix systems,
you may need to adjust directory permissions or use `sudo` for global
installation.
