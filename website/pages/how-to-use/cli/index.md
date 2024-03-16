---
description: >
  See how you can create avatars with the DiceBear CLI. It's free and supports
  all official avatar styles.
---

# CLI

With the CLI you can create thousands of avatars in no time!

## Installation

Make sure you have [Node.js](https://nodejs.org/en/) and NPM installed.

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

Replace `<style>` with an avatar style name (camelCase) and `[outputPath]` with
a target directory. If `[outputPath]` is omitted, the current directory is used
as target directory.

```
dicebear <style> [outputPath]
```

For example, to create an avatar with the [lorelei](/styles/lorelei/) avatar
style, use the following command:

```
dicebear lorelei .
```

:::info

We provide a large number of avatar styles from different designers. The designs
are licensed under different licenses that the designers can choose themselves.
For a quick overview we have created an [license overview](/licenses/) for you.

:::

### Create multiple avatars

You can also create multiple avatars at once! Just use the `--count` option.
Replace `<count>` with the number of avatars to create.

```
dicebear <style> [outputPath] --count <count>
```

:::warning

The `seed` option has no effect in combination with the `count` option. If
`count` is greater than `1`, random values are generated and used as `seed` to
make the avatars differ from each other.

:::

### Passing options

You can find out what options are available with [--help](#show-help). Besides
the options provided by the avatar styles, there are the following additional
options:

```
--count      Defines how many avatars to create.          [number]
--format                                                  [string] [choices: "svg", "png", "jpg", "jpeg", "json"]
--exif       Include Exif Metadata                        [boolean]
--json       Save JSON file in addition to image file     [boolean]
```

As you can see, you can also create the avatars in a format other than SVG. For
example, to create a PNG avatar of the avatar style [lorelei](/styles/lorelei/),
use the following command:

```
dicebear lorelei . --format png
```

### Show help

For each command you can ask for help.

```
dicebear --help
```

```
dicebear <command>

Commands:
  dicebear adventurer [outputPath]         Generate "adventurer" avatar(s)
  dicebear adventurerNeutral [outputPath]  Generate "adventurerNeutral" avatar(s)
  dicebear avataaars [outputPath]          Generate "avataaars" avatar(s)
  dicebear avataaarsNeutral [outputPath]   Generate "avataaarsNeutral" avatar(s)
  dicebear bigEars [outputPath]            Generate "bigEars" avatar(s)
  dicebear bigEarsNeutral [outputPath]     Generate "bigEarsNeutral" avatar(s)
  dicebear bigSmile [outputPath]           Generate "bigSmile" avatar(s)
  dicebear bottts [outputPath]             Generate "bottts" avatar(s)
  dicebear botttsNeutral [outputPath]      Generate "botttsNeutral" avatar(s)
  dicebear croodles [outputPath]           Generate "croodles" avatar(s)
  dicebear croodlesNeutral [outputPath]    Generate "croodlesNeutral" avatar(s)
  dicebear funEmoji [outputPath]           Generate "funEmoji" avatar(s)
  dicebear icons [outputPath]              Generate "icons" avatar(s)
  dicebear identicon [outputPath]          Generate "identicon" avatar(s)
  dicebear initials [outputPath]           Generate "initials" avatar(s)
  dicebear lorelei [outputPath]            Generate "lorelei" avatar(s)
  dicebear loreleiNeutral [outputPath]     Generate "loreleiNeutral" avatar(s)
  dicebear micah [outputPath]              Generate "micah" avatar(s)
  dicebear miniavs [outputPath]            Generate "miniavs" avatar(s)
  dicebear openPeeps [outputPath]          Generate "openPeeps" avatar(s)
  dicebear personas [outputPath]           Generate "personas" avatar(s)
  dicebear pixelArt [outputPath]           Generate "pixelArt" avatar(s)
  dicebear pixelArtNeutral [outputPath]    Generate "pixelArtNeutral" avatar(s)
  dicebear shapes [outputPath]             Generate "shapes" avatar(s)
  dicebear thumbs [outputPath]             Generate "thumbs" avatar(s)

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
