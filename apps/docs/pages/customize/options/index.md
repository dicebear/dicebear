---
title: Core Options
description: >
  The options every DiceBear core understands, shared across the JavaScript,
  PHP, Python, Rust, Go, Dart, and C# libraries and the HTTP API: seed, flip,
  rotate, scale, size, background, and the per-component and per-color options.
---

# Core options

These options are the same across every DiceBear core: the JavaScript, PHP,
Python, Rust, Go, Dart, and C# libraries, and the
[HTTP API](/integrations/http-api/). Only the way you pass them differs from one
language to the next, so each library page shows that in its own syntax. The
names, types, defaults, and behavior below do not change.

They apply to every avatar style. Where the type lists `[min, max]`, you may
pass either a fixed value or a two-element tuple. The PRNG samples a value from
the tuple's range.

| Option            | Type                                             | Default       | Description                                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `seed`            | `string`                                         | `''`          | Seed for deterministic generation                                                                                                                                                                                 |
| `flip`            | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`      | Flip the avatar (accepts an array of values to randomize)                                                                                                                                                         |
| `rotate`          | `number \| [min, max]`                           | `0`           | Rotation in degrees (−360 to 360)                                                                                                                                                                                 |
| `scale`           | `number \| [min, max]`                           | `1`           | Uniform scale factor around the canvas center (0 to 10; `1` is original size)                                                                                                                                     |
| `borderRadius`    | `number \| [min, max]`                           | `0`           | Border radius in percent of the canvas (0 to 50; `50` makes a circle)                                                                                                                                             |
| `size`            | `integer`                                        | _unset_       | Output size in pixels (1 to 4096); when unset the SVG scales to its container                                                                                                                                     |
| `translateX`      | `number \| [min, max]`                           | `0`           | Horizontal translation in percent of the canvas width (−1000 to 1000)                                                                                                                                             |
| `translateY`      | `number \| [min, max]`                           | `0`           | Vertical translation in percent of the canvas height (−1000 to 1000)                                                                                                                                              |
| `idRandomization` | `boolean`                                        | `false`       | Suffix every SVG `id` with a random, non-deterministic value (avoids `url(#…)` collisions when several avatars share a page)                                                                                      |
| `title`           | `string`                                         | _unset_       | Accessible title; when set, the SVG becomes `role="img"` with `<title>`                                                                                                                                           |
| `fontFamily`      | `string \| string[]`                             | `'system-ui'` | Font family for text-based styles (CSS-style font stack, no quotes)                                                                                                                                               |
| `fontWeight`      | `integer \| integer[]`                           | `400`         | Font weight for text-based styles (1 to 1000)                                                                                                                                                                     |
| `tags`            | `string \| string[]`                             | _unset_       | Keep only variants matching these [tags](/customize/tags/) (`category` or `category:value`, prefix with `!` to disallow)                                                                                          |
| `animation`       | `boolean \| name \| name[]`                      | `false`       | Play the style's built-in animations: `true` plays all of them, a name or list of names (such as `"blink"`) only those. Off by default, so SVG and raster output stay static. Styles without animations ignore it |
| `animationSpeed`  | `number \| [min, max]`                           | `1`           | Playback speed multiplier for animations (0.1 to 10; `2` plays twice as fast). Only meaningful with `animation: true`                                                                                             |

## Background options

These options are available for every style, even ones that don't declare a
`background` color group in their definition.

| Option                     | Type                              | Default    | Description                                                        |
| -------------------------- | --------------------------------- | ---------- | ------------------------------------------------------------------ |
| `backgroundColor`          | `string \| string[]`              | _unset_    | Background colors as hex (`#` optional, `#RGB` to `#RRGGBBAA`)     |
| `backgroundColorFill`      | `'solid' \| 'linear' \| 'radial'` | `'solid'`  | Background fill type (accepts an array of values to randomize)     |
| `backgroundColorFillStops` | `integer \| [min, max]`           | `2`        | Number of gradient stops (minimum 2); ignored when fill is `solid` |
| `backgroundColorAngle`     | `number \| [min, max]`            | `0`        | Gradient angle in degrees (−360 to 360)                            |
| `backgroundColorOrder`     | `'random' \| 'fixed'`             | `'random'` | Use the given colors in order (`fixed`) instead of shuffling them  |

## Dynamic component options

For each component in a style (e.g. `eyes`, `mouth`, `hair`), the following
options are available:

| Pattern                  | Type                                        | Description                                            |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------ |
| `{component}Variant`     | `string \| string[] \| { variant: weight }` | Restrict to specific variants, optionally with weights |
| `{component}Probability` | `number`                                    | Visibility probability in percent (0 to 100)           |

A component's rotation, translation, and scale are sampled at render time from
the component definition and are **not** user options: there are no
`{component}Rotate`, `{component}TranslateX`, `{component}TranslateY`, or
`{component}Scale` options.

Component aliases (declared via `extends` in the style definition) do not expose
their own option keys. They share `{source}Variant` and `{source}Probability`
with the component they extend.

## Dynamic color options

For each color group in a style (e.g. `skin`, `hair`) and `background`, the
following options are available:

| Pattern                 | Type                              | Description                                                        |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `{color}Color`          | `string \| string[]`              | Override the palette with hex values (`#` optional)                |
| `{color}ColorFill`      | `'solid' \| 'linear' \| 'radial'` | Fill type (accepts an array of values to randomize)                |
| `{color}ColorFillStops` | `integer \| [min, max]`           | Number of gradient stops (minimum 2); ignored when fill is `solid` |
| `{color}ColorAngle`     | `number \| [min, max]`            | Gradient angle in degrees (−360 to 360)                            |
| `{color}ColorOrder`     | `'random' \| 'fixed'`             | Use the given colors in order (`fixed`) instead of shuffling them  |

With `{color}ColorOrder: 'fixed'`, colors passed via `{color}Color` keep exactly
the order you give them: gradient fills apply them as stops from first to last,
solid fills always use the first color, and the number of gradient stops
defaults to the number of given colors. Without `{color}Color`, `fixed` only
skips the shuffle; the style's palette is deduplicated and used in sorted order.
Constraints in the style definition (`contrastTo`, `notEqualTo`) still apply, so
the result can stay seed-dependent through the referenced color groups.

## Variant tags

When a style tags its variants, the `tags` option filters the variant pool to
the traits you want, across every component at once. A tag is `category` or
`category:value`, such as `animation` or `hairLength:long`. Within one category
the values combine with "or", different categories combine with "and", a bare
category requires the trait, and a leading `!` disallows. See
[Filter variants with tags](/customize/tags/) for the full rules and the
categories DiceBear's styles use.
