---
title: Upgrading to DiceBear 11
description: >
  What changes when you move from DiceBear 10.x or 9.x to 11.x. Core 11 draws
  the 10.x styles unchanged, so the core can go first and the styles follow.
---

# Upgrading to DiceBear 11

## From 10.x

You can update the core and keep your styles. Core 11 draws the 10.x styles
exactly as Core 10 did: the same SVG for every style and seed, animated variants
included, with one new attribute, `data-dicebear-component`, on each component.
The HTTP API draws the same images under `/10.x/`. The breaking changes are
mostly in Styles 11, so you can switch to them when you're ready.

These changes come with Core 11, whatever styles you use:

- **`new Avatar()`** takes a `Style` and no longer a raw definition:
  `new Avatar(new Style(definition), options)`.
- **Color helpers:** `Color` is no longer exported in JavaScript, Python, Rust,
  Go and Dart.
- **Go:** Import the core from `github.com/dicebear/dicebear-go/v11`.
- **CLI:** Style names are no longer commands. `dicebear lorelei` is now
  `dicebear create lorelei`, which prints to stdout unless `-o` names a file or
  directory, and `--optimize` is now `dicebear optimize`. See
  [CLI](/integrations/cli/).
- **`{color}ColorOrder: 'fixed'`:** Core 11 draws from a palette in the order
  the definition lists it, where Core 10 sorted the values first. Sorting the
  palette in the definition gives you the old order back. A gradient now uses
  every palette color as a stop unless `{color}ColorFillStops` is set, and a
  color with `contrastTo` is no longer sorted by contrast. Without this option,
  nothing changes.
- **Ill-formed text:** A seed with broken Unicode, such as an emoji cut in half
  by `slice()`, renders a different avatar.

These changes come with Styles 11, which need Core 11:

- **Animated styles:** [Animations](/animated-avatars/) live in the style
  definitions now. The `animationVariant` option and the `animation` tag are
  gone. Pass `animation: true` instead.
- **Removed variants:** Four variants were copies of another one and are gone:
  the icon `brightnessHigh`, the Pixel Art clothes `variant14`, the Slice cut
  `sixStep` and the Stripes stripe `variant10`. Options that still name them
  raise no error, but the avatar is drawn without that part, and other seeds
  pick differently too: about a third of the Icons and Slice avatars and a
  quarter of the Pixel Art avatars change.
- **Drawings:** Fixes change some avatars. Pixel Art shows dark beards in full,
  which 10.x drew barely visible, Stripes adds stripes at the edges, so nearly
  every Stripes avatar changes, Notionists closes a gap between hair and head in
  24 hair variants, and the natural unibrow of Avataaars takes the color of the
  other eyebrows. Hair and mouth colors that blended into the skin moved away
  from it: Big Smile hair no longer takes the skin color, which changes the hair
  color of about one in ten avatars, Open Peeps hair no longer matches `#ae5d29`
  skin, and six hair colors of Voxel Art and one mouth color of Pixel Art shift
  by a shade.
- **Tags:** 35 character styles tag their variants now, and a few tags were
  corrected, so a `tags` filter can pick differently than in 10.x.
- **Go:** Import the styles from `github.com/dicebear/styles/v11`.

## From 9.x

10.0 rebuilt DiceBear, so moving from 9.x is a port rather than an update, and
everything under [From 10.x](#from-10-x) applies on top. Expect different
avatars: the same seed draws a different picture in 11.x than in 9.x. If you
store avatar URLs, the HTTP API keeps answering `/9.x/` with the old images. 9.x
itself still gets security fixes, with no end announced, and its documentation
stays online at [v9.dicebear.com](https://v9.dicebear.com).

### Packages and code

`@dicebear/collection` and the packages per style, such as `@dicebear/lorelei`,
are gone. Every style is a JSON definition in
[`@dicebear/styles`](/integrations/javascript/), and `createAvatar()` became two
classes:

**Before (9.x):**

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, { seed: 'Felix' });
```

**After (11.x):**

```js
import { Avatar, Style } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(new Style(lorelei), { seed: 'Felix' });
```

To load a style by name instead, `await get('lorelei')` from `@dicebear/styles`
returns its definition, and bundlers put each one into a chunk of its own.
`toString()` and `toDataUri()` work as before, and `toJson()` is now `toJSON()`,
which returns the SVG together with the options it was drawn with. `toPng()` and
the other formats stay in `@dicebear/converter`. On the command line,
`dicebear lorelei ./avatars` is now `dicebear create lorelei -o ./avatars`.

### Options

Options that pick a component variant end in `Variant` now, and some variant
names changed with the move to JSON, so check the page of your style:

```js
// 9.x
{
  eyes: ['blink'];
}

// 11.x
{
  eyesVariant: ['blink'];
}
```

Most of the general options kept their name and meaning: `seed`, `size`,
`rotate`, `translateX`, `translateY`, the colors and the `Probability` options.
These changed:

| 9.x                                  | 11.x                                                 |
| ------------------------------------ | ---------------------------------------------------- |
| `flip: true`                         | `flip: 'horizontal'`, also `'vertical'` and `'both'` |
| `scale: 80`, in percent              | `scale: 0.8`, as a factor                            |
| `radius: 50`                         | `borderRadius: 50`                                   |
| `backgroundType: ['gradientLinear']` | `backgroundColorFill: 'linear'`, also `'radial'`     |
| `backgroundRotation: [0, 360]`       | `backgroundColorAngle: [0, 360]`                     |
| `backgroundColor: ['transparent']`   | `backgroundColor: []`                                |
| `randomizeIds: true`                 | `idRandomization: true`                              |
| `clip: false`                        | gone, the avatar always stays inside its box         |
