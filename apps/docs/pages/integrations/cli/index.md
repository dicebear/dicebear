---
title: CLI – Generate Avatars from the Command Line
description: >
  Generate avatars in bulk with the DiceBear CLI. Free command-line avatar
  generator for creating profile pictures and user placeholder images. All
  styles supported.
---

# CLI

With the CLI you can generate large numbers of avatars in a single run.

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

## Usage

### Create an avatar

Replace `<style>` with an avatar style name (lowercase, kebab-case for
multi-word styles, e.g. `lorelei`, `pixel-art`, `adventurer-neutral`) and
`[outputPath]` with a target directory. If `[outputPath]` is omitted, the
current directory is used as target directory.

```
dicebear <style> [outputPath]
```

For example, to create an avatar with the [lorelei](/styles/lorelei/) avatar
style, use the following command:

```
dicebear lorelei ./avatars
```

The avatar will be saved as `lorelei-0.svg` in the `./avatars` directory.

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

### Create multiple avatars

You can also create multiple avatars at once with the `--count` option. Replace
`<count>` with the number of avatars to create.

```
dicebear <style> [outputPath] --count <count>
```

For example, to create 100 avatars:

```
dicebear lorelei ./avatars --count 100
```

This generates files named `lorelei-0.svg`, `lorelei-1.svg`, ...,
`lorelei-99.svg`.

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

You can create avatars in various formats using the `--format` option:

| Format | Description                        |
| ------ | ---------------------------------- |
| `svg`  | Scalable Vector Graphics (default) |
| `png`  | PNG image                          |
| `jpg`  | JPEG image                         |
| `jpeg` | JPEG image (alias for jpg)         |
| `webp` | WebP image                         |
| `avif` | AVIF image                         |
| `json` | JSON with avatar metadata          |

Example:

```
dicebear lorelei ./avatars --format png
```

#### Controlling the output image size

`--size` controls the output dimensions (width and height in pixels) for all
formats. The default is `512`. For rasterized formats (PNG, JPEG, WebP, AVIF)
the value is capped at `2048`.

```
dicebear lorelei ./avatars --format png --size 256
```

#### Adding Exif metadata

When creating PNG, JPEG, WebP, or AVIF images, you can include Exif metadata:

```
dicebear lorelei ./avatars --format png --exif
```

#### Saving JSON alongside images

You can save a JSON file with avatar metadata alongside each image:

```
dicebear lorelei ./avatars --format png --json
```

This creates both `lorelei-0.png` and `lorelei-0.json` for each avatar.

### Passing style options

Each avatar style has its own customization options. To see all available
options for a specific style, use `--help`:

```
dicebear lorelei --help
```

Example output:

```
dicebear lorelei [outputPath]

Generate "lorelei" avatar(s)

Options:
      --version            Show version number                         [boolean]
      --help               Show help                                   [boolean]
      --count              Defines how many avatars to create.          [number]
      --format                [string] [choices: "svg", "png", "jpg", ...]
      --exif               Include Exif Metadata                       [boolean]
      --json               Save JSON file in addition to image file    [boolean]
      --seed                                                            [string]
      --flip                                                            [string]
      --rotate                                                          [number]
      --scale                                                           [number]
      --borderRadius                                                    [number]
      --size                                                            [number]
      --backgroundColor                                                  [array]
      --translateX                                                      [number]
      --translateY                                                      [number]
      --idRandomization                                                [boolean]
      --title                                                           [string]
      --fontFamily                                                      [string]
      --fontWeight                                                      [number]
      ... (style-specific options)
```

Example with options:

```
dicebear lorelei ./avatars --backgroundColor b6e3f4,c0aede,d1d4f9 --size 128
```

### Output file naming

Files are named using the pattern `{style}-{index}.{format}`:

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
about the style's creator and license:

```
----------------------------------------------------------------
Lorelei by Lisa Wischofsky
Homepage: https://www.instagram.com/lischi_art/
Source: https://www.figma.com/community/file/1198749693280469639
License: CC0 1.0 - https://creativecommons.org/publicdomain/zero/1.0/
----------------------------------------------------------------
```

### Show help

For general help and a list of all available styles:

```
dicebear --help
```

```
dicebear <command>

Commands:
  dicebear adventurer [outputPath]          Generate "adventurer" avatar(s)
  dicebear adventurer-neutral [outputPath]  Generate "adventurer-neutral" avatar(s)
  dicebear avataaars [outputPath]           Generate "avataaars" avatar(s)
  dicebear avataaars-neutral [outputPath]   Generate "avataaars-neutral" avatar(s)
  dicebear big-ears [outputPath]            Generate "big-ears" avatar(s)
  dicebear big-ears-neutral [outputPath]    Generate "big-ears-neutral" avatar(s)
  dicebear big-smile [outputPath]           Generate "big-smile" avatar(s)
  dicebear bottts [outputPath]              Generate "bottts" avatar(s)
  dicebear bottts-neutral [outputPath]      Generate "bottts-neutral" avatar(s)
  dicebear croodles [outputPath]            Generate "croodles" avatar(s)
  dicebear croodles-neutral [outputPath]    Generate "croodles-neutral" avatar(s)
  dicebear dylan [outputPath]               Generate "dylan" avatar(s)
  dicebear fun-emoji [outputPath]           Generate "fun-emoji" avatar(s)
  dicebear glass [outputPath]               Generate "glass" avatar(s)
  dicebear icons [outputPath]               Generate "icons" avatar(s)
  dicebear identicon [outputPath]           Generate "identicon" avatar(s)
  dicebear initial-face [outputPath]        Generate "initial-face" avatar(s)
  dicebear initials [outputPath]            Generate "initials" avatar(s)
  dicebear lorelei [outputPath]             Generate "lorelei" avatar(s)
  dicebear lorelei-neutral [outputPath]     Generate "lorelei-neutral" avatar(s)
  dicebear micah [outputPath]               Generate "micah" avatar(s)
  dicebear miniavs [outputPath]             Generate "miniavs" avatar(s)
  dicebear notionists [outputPath]          Generate "notionists" avatar(s)
  dicebear notionists-neutral [outputPath]  Generate "notionists-neutral" avatar(s)
  dicebear open-peeps [outputPath]          Generate "open-peeps" avatar(s)
  dicebear personas [outputPath]            Generate "personas" avatar(s)
  dicebear pixel-art [outputPath]           Generate "pixel-art" avatar(s)
  dicebear pixel-art-neutral [outputPath]   Generate "pixel-art-neutral" avatar(s)
  dicebear rings [outputPath]               Generate "rings" avatar(s)
  dicebear shape-grid [outputPath]          Generate "shape-grid" avatar(s)
  dicebear shapes [outputPath]              Generate "shapes" avatar(s)
  dicebear thumbs [outputPath]              Generate "thumbs" avatar(s)
  dicebear toon-head [outputPath]           Generate "toon-head" avatar(s)

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Custom styles

You can use any JSON [definition file](/create-styles/definition-schema/) as a
style, including your own custom styles or styles exported from the
[Figma plugin](/create-styles/with-figma/).

Just pass the path to the JSON file instead of a style name:

```
dicebear ./my-style.json ./avatars
```

All available options are automatically detected from the definition. Use
`--help` to see them:

```
dicebear ./my-style.json --help
```

Generate multiple avatars in PNG format:

```
dicebear ./my-style.json ./avatars --count 20 --format png
```

### Compressing a definition file

Definition files exported from the [Figma plugin](/create-styles/with-figma/)
are already compressed on export. A definition you wrote or edited by hand is
not, and its path data usually has a lot of room left. `--optimize` runs the
same [svgo](https://github.com/svg/svgo) pass over every element tree in the
file and rewrites it in place:

```
dicebear ./my-style.json --optimize
```

```
  my-style.json   25.5 KB -> 22.1 KB (-12.8%)
```

Use `--optimize-precision` to control how many decimals path and transform data
keep. The default is `3`. Lower values compress harder at the cost of accuracy:

```
dicebear ./my-style.json --optimize --optimize-precision 1
```

`--optimize-check` reports whether the file is optimized without writing
anything, and exits with a non-zero status if it is not. This is what you want
in continuous integration:

```
dicebear ./my-style.json --optimize-check
```

Colors, component references, dynamic values, element ids, CSS classes and the
contents of `<style>` elements all survive unchanged, and component `width` and
`height` are never touched. The CLI verifies this on every run and refuses to
write the file if anything moved, so an optimized definition renders the same
avatars as before.

:::info

Optimizing always rewrites the file in place, so `[outputPath]` is ignored. Copy
the file first if you want to keep the original around. Built-in styles have no
definition file of their own and cannot be optimized.

:::

## Examples

### Generate a single avatar with a specific seed

```
dicebear avataaars ./avatars --seed "john-doe"
```

### Generate 50 PNG avatars with custom background

```
dicebear bottts ./avatars --count 50 --format png --backgroundColor b6e3f4
```

### Generate avatars with JSON metadata

```
dicebear pixel-art ./avatars --count 10 --format webp --json
```

### Generate initials avatar

```
dicebear initials ./avatars --seed "Alice"
```

## Troubleshooting

### "File already exists" error

The CLI does not overwrite existing files. Either:

- Use an empty output directory
- Delete existing files before regenerating

### Avatar style not found

Style names are lowercase, with hyphens for multi-word styles (e.g. `pixel-art`,
`adventurer-neutral`). Run `dicebear --help` to see all available styles.

### Permission denied

Make sure you have write permissions to the output directory. On Unix systems,
you may need to adjust directory permissions or use `sudo` for global
installation.
