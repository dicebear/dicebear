---
title: Create an Avatar Style from Scratch | DiceBear
description: >
  Learn how to create a DiceBear avatar style from scratch using TypeScript
  without the plugin for Figma.
---

# Create an avatar style from Scratch

We highly recommend our
[plugin for Figma](/guides/create-an-avatar-style-with-figma/) to create an avatar
style. Most of DiceBear official avatar styles were created with the plugin. But
with appropriate programming skills you can also create an avatar style without
Figma.

## Interfaces

```ts
interface AvatarStyle {
  meta?: {
    title?: string;
    source?: string;
    creator?: string;
    homepage?: string;
    license?: {
      name: string;
      url: string;
    };
  };
  schema?: JSONSchema7;
  create(props: { prng: Prng; options: object }): {
    attributes: {
      viewBox: string;
      [key: string]: string;
    };
    body: string;
  };
}

interface Prng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[], fallback?: T): T | undefined;
  shuffle<T>(arr: T[]): T[];
  string(length: number, characters?: string): string;
}
```

## Minimal Example

A minimal example of an avatar style with a circle colored red or blue by the
PRNG based on a seed.

```ts
const style = {
  create: ({ prng, options }) => {
    const attributes = {
      viewBox: '0 0 100 100',
    };

    const fill = prng.bool() ? 'red' : 'blue';
    const body = `<circle cx="50" cy="50" r="50" fill="${fill}" />`;

    return { attributes, body };
  },
};
```

As you can see, it doesn't take much to create an avatar style. Both the
metadata and the JSON schema are optional. The `create` method takes the PRNG
and options and creates the avatar. What you do exactly in this function is up
to you.

If you specify metadata, it will be placed in the metadata of the created
avatars. If none are specified, the avatar's metadata is empty accordingly.

The JSON Schema object describes the allowed options that can be passed to the
`createAvatar` option. It is mainly used by the CLI, the API and the
documentation. So you can leave the object empty without any real disadvantages.
But it can help to document your avatar style.

## PRNG Methods

The `prng` object provides deterministic randomness — the same seed always
produces the same result. Here is what each method is useful for:

**`prng.bool(likelihood?)`** — Returns `true` or `false`. The optional
`likelihood` parameter (0–100) sets the probability of `true`. Useful for
toggling optional elements on or off.

```ts
// Show glasses on ~40% of avatars
const hasGlasses = prng.bool(40);
const body = hasGlasses
  ? `<circle cx="35" cy="45" r="8" fill="none" stroke="black" stroke-width="2" />
     <circle cx="65" cy="45" r="8" fill="none" stroke="black" stroke-width="2" />`
  : '';
```

**`prng.integer(min, max)`** — Returns a random integer between `min` and `max`
(inclusive). Useful for sizes, positions, or rotation angles.

```ts
// Random rotation between -15° and 15°
const angle = prng.integer(-15, 15);
const body = `<rect x="25" y="25" width="50" height="50"
  transform="rotate(${angle} 50 50)" fill="steelblue" />`;
```

**`prng.pick(arr)`** — Picks one item from an array. Useful for selecting a
color from a palette or choosing a component variant.

```ts
// Pick a random background color
const palette = ['#f9c74f', '#90be6d', '#43aa8b', '#577590', '#f94144'];
const color = prng.pick(palette);
```

**`prng.shuffle(arr)`** — Returns a shuffled copy of the array. Useful for
varying the layering order of elements.

```ts
// Randomize the order of decorative stripes
const stripes = ['#e63946', '#457b9d', '#2a9d8f'];
const shuffled = prng.shuffle(stripes);
const body = shuffled
  .map((c, i) => `<rect x="0" y="${i * 34}" width="100" height="34" fill="${c}" />`)
  .join('');
```

## Real-world examples

For production-ready reference implementations, take a look at the source code
of simpler official styles on GitHub:

- [`@dicebear/shapes`](https://github.com/dicebear/dicebear/tree/main/packages/%40dicebear/shapes/src) — geometric shapes, minimal dependencies
- [`@dicebear/identicon`](https://github.com/dicebear/dicebear/tree/main/packages/%40dicebear/identicon/src) — grid-based identicon, shows integer usage
