---
title: Core Options
description: >
  The options every DiceBear core understands, shared across the JavaScript,
  PHP, Python, Rust, Go, Dart, and C# libraries and the HTTP API: seed, flip,
  rotate, scale, size, background, and the per-component and per-color options.
---

# Core options

These options work with every avatar style, in every DiceBear library and in the
[HTTP API](/integrations/http-api/). Only the syntax for passing them differs,
and each library page shows its own.

Where the type lists `[min, max]`, pass either a fixed value or a two-element
range, and the seed picks a value within it.

| Option            | Type                                             | Default       | Description                                                                                                              |
| ----------------- | ------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `seed`            | `string`                                         | `''`          | Seed for deterministic generation                                                                                        |
| `flip`            | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`      | Flip the avatar (accepts an array of values to randomize)                                                                |
| `rotate`          | `number \| [min, max]`                           | `0`           | Rotation in degrees (−360 to 360)                                                                                        |
| `scale`           | `number \| [min, max]`                           | `1`           | Uniform scale factor around the canvas center (0 to 10, `1` is original size)                                            |
| `borderRadius`    | `number \| [min, max]`                           | `0`           | Border radius in percent of the canvas (0 to 50, `50` makes a circle)                                                    |
| `size`            | `integer`                                        | _unset_       | Output size in pixels (1 to 4096). When unset, the SVG scales to its container                                           |
| `translateX`      | `number \| [min, max]`                           | `0`           | Horizontal translation in percent of the canvas width (−1000 to 1000)                                                    |
| `translateY`      | `number \| [min, max]`                           | `0`           | Vertical translation in percent of the canvas height (−1000 to 1000)                                                     |
| `idRandomization` | `boolean`                                        | `false`       | Add a random suffix to every SVG `id`, so the IDs of inlined avatars on one page don't collide                           |
| `title`           | `string`                                         | _unset_       | Accessible title. When set, the SVG becomes `role="img"` with `<title>`                                                  |
| `fontFamily`      | `string \| string[]`                             | `'system-ui'` | Font family for text-based styles (CSS-style font stack, no quotes)                                                      |
| `fontWeight`      | `integer \| integer[]`                           | `400`         | Font weight for text-based styles (1 to 1000)                                                                            |
| `tags`            | `string \| string[]`                             | _unset_       | Keep only variants matching these [tags](/customize/tags/) (`category` or `category:value`, prefix with `!` to disallow) |
| `animation`       | `boolean`                                        | `false`       | Play the style's animations. Styles without animations ignore it                                                         |
| `*Animation`      | `boolean`                                        | _unset_       | Switch one animation by name, such as `blinkAnimation: true`. Wins over `animation`                                      |
| `animationSpeed`  | `number \| [min, max]`                           | `1`           | Playback speed factor (0.1 to 10, `2` plays twice as fast)                                                               |
| `*AnimationSpeed` | `number \| [min, max]`                           | _unset_       | Speed of one animation by name, such as `blinkAnimationSpeed: 2`. Wins over `animationSpeed`                             |
| `animationDelay`  | `number \| [min, max]`                           | `0`           | Start offset in seconds (−3600 to 3600), applied after the speed. As a range, every seed starts at its own moment        |
| `*AnimationDelay` | `number \| [min, max]`                           | _unset_       | Start offset of one animation by name, such as `blinkAnimationDelay: [0, 3]`. Wins over `animationDelay`                 |

## Background options

These options are available for every style, even ones that don't declare a
`background` color group in their definition.

| Option                     | Type                              | Default    | Description                                                        |
| -------------------------- | --------------------------------- | ---------- | ------------------------------------------------------------------ |
| `backgroundColor`          | `string \| string[]`              | _unset_    | Background colors as hex (`#` optional, `#RGB` to `#RRGGBBAA`)     |
| `backgroundColorFill`      | `'solid' \| 'linear' \| 'radial'` | `'solid'`  | Background fill type (accepts an array of values to randomize)     |
| `backgroundColorFillStops` | `integer \| [min, max]`           | `2`        | Number of gradient stops (minimum 2), ignored when fill is `solid` |
| `backgroundColorAngle`     | `number \| [min, max]`            | `0`        | Gradient angle in degrees (−360 to 360)                            |
| `backgroundColorOrder`     | `'random' \| 'fixed'`             | `'random'` | Use the given colors in order (`fixed`) instead of shuffling them  |

## Dynamic component options

For each component in a style (e.g. `eyes`, `mouth`, `hair`), the following
options are available:

| Pattern                  | Type                                        | Description                                            |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------ |
| `{component}Variant`     | `string \| string[] \| { variant: weight }` | Restrict to specific variants, optionally with weights |
| `{component}Probability` | `number`                                    | Visibility probability in percent (0 to 100)           |

Components have no rotate, translate, or scale options. The style definition
sets those ranges, and the seed picks from them.

A component alias (declared with `extends` in the style definition) has no
options of its own. It shares `{source}Variant` and `{source}Probability` with
the component it extends.

## Dynamic color options

For each color group in a style (e.g. `skin`, `hair`) and `background`, the
following options are available:

| Pattern                 | Type                              | Description                                                        |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `{color}Color`          | `string \| string[]`              | Override the palette with hex values (`#` optional)                |
| `{color}ColorFill`      | `'solid' \| 'linear' \| 'radial'` | Fill type (accepts an array of values to randomize)                |
| `{color}ColorFillStops` | `integer \| [min, max]`           | Number of gradient stops (minimum 2), ignored when fill is `solid` |
| `{color}ColorAngle`     | `number \| [min, max]`            | Gradient angle in degrees (−360 to 360)                            |
| `{color}ColorOrder`     | `'random' \| 'fixed'`             | Use the given colors in order (`fixed`) instead of shuffling them  |

With `{color}ColorOrder: 'fixed'`, the colors keep the order they are given in,
from `{color}Color` or from the style's palette. Solid fills use the first
color. Gradient fills use the colors as stops from first to last, with as many
stops as colors unless you set `{color}ColorFillStops`. The style's `contrastTo`
constraint is skipped, but `notEqualTo` still applies, so the result can still
depend on the seed through the referenced color groups.
