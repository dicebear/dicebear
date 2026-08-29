<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Avatar Library</h1>

<p>
  <img src="https://www.dicebear.com/readme-hero.svg" alt="A grid of DiceBear avatars in twenty-four different styles" width="100%" />
</p>

[![npm](https://www.dicebear.com/badges/npm.svg)](https://www.npmjs.com/package/@dicebear/core)
[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](./LICENSE)

DiceBear is an open source avatar library. It turns any seed string (a username
or an email address, for example) into an SVG avatar in one of 61 styles, from
hand-drawn characters to abstract patterns. The same seed always produces the
same avatar, so you store a string instead of an image and never ask users to
upload a profile picture.

Avatars are customizable through style options: colors, backgrounds, rotation,
individual features like hair or glasses.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/start/what-is-dicebear/) |
[Editor](https://editor.dicebear.com)

## One library, seven languages

DiceBear 10 ships as native libraries for JavaScript, PHP, Python, Rust, Go,
Dart, and C#. Every port passes a shared test suite that requires byte-identical
SVG output to the JavaScript reference. Generate an avatar in the browser,
regenerate it later in a Go or PHP backend, and you get the same bytes.

| Language                | Package                                                                 | Install                                      |
| ----------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| JavaScript / TypeScript | [`@dicebear/core`](https://www.npmjs.com/package/@dicebear/core)        | `npm install @dicebear/core`                 |
| PHP                     | [`dicebear/core`](https://packagist.org/packages/dicebear/core)         | `composer require dicebear/core`             |
| Python                  | [`dicebear-core`](https://pypi.org/project/dicebear-core/)              | `pip install dicebear-core`                  |
| Rust                    | [`dicebear-core`](https://crates.io/crates/dicebear-core)               | `cargo add dicebear-core`                    |
| Go                      | [`dicebear-go`](https://pkg.go.dev/github.com/dicebear/dicebear-go/v10) | `go get github.com/dicebear/dicebear-go/v10` |
| Dart                    | [`dicebear_core`](https://pub.dev/packages/dicebear_core)               | `dart pub add dicebear_core`                 |
| C#                      | [`DiceBear.Core`](https://www.nuget.org/packages/DiceBear.Core)         | `dotnet add package DiceBear.Core`           |

In JavaScript it looks like this; the
[documentation](https://www.dicebear.com/start/what-is-dicebear/) has the
equivalent for each language:

```js
import { Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(definition, {
  seed: 'John Doe',
  size: 128,
});

avatar.toString(); // SVG string
avatar.toDataUri(); // data:image/svg+xml;charset=utf-8,...
```

The 61 avatar styles are plain JSON definitions from the
[`dicebear/styles`](https://github.com/dicebear/styles) repository, available as
a package for each language. You can also
[create your own style](https://www.dicebear.com/create-styles/with-figma/),
with Figma or from scratch.

## Without writing code

- The [HTTP API](https://www.dicebear.com/integrations/http-api/) returns
  avatars from a plain URL, free and without an account:
  `https://api.dicebear.com/10.x/lorelei/svg?seed=Felix`. For full control and
  privacy you can
  [host it yourself](https://www.dicebear.com/recipes/self-host-the-http-api/)
  with a single Docker container.
- The [CLI](https://www.dicebear.com/integrations/cli/) generates avatar files
  in bulk: `npx dicebear lorelei --count 10`.
- The [editor](https://editor.dicebear.com) lets you assemble a single avatar by
  hand and export it.

## This repository

This monorepo contains the seven core libraries, the CLI, the SVG-to-raster
converter, the documentation site ([dicebear.com](https://www.dicebear.com)),
and the editor. Related projects live in their own repositories:

- [`dicebear/styles`](https://github.com/dicebear/styles): the official avatar
  style definitions
- [`dicebear/schema`](https://github.com/dicebear/schema): the JSON Schema
  behind definitions and options
- [`dicebear/api`](https://github.com/dicebear/api): the self-hostable HTTP API
- [`dicebear/studio`](https://github.com/dicebear/studio): DiceBear Studio, the
  Figma plugin for style authors

Contributions are welcome; [CONTRIBUTING.md](./CONTRIBUTING.md) explains the
setup and where each kind of change belongs.

## License

The code is [MIT licensed](./LICENSE), including commercial use. The avatar
styles are the work of their respective creators and carry their own licenses;
the [license overview](https://www.dicebear.com/licenses/) lists them all, and
many only ask for attribution.

## Star this repository

If DiceBear saved you some work, a star makes the project easier to find for the
next person looking for an avatar library. The
[support page](https://www.dicebear.com/support/) lists the other ways to help.

## Sponsors

Advertisement: Many thanks to our sponsors who provide us with free or
discounted products.

<a href="https://bunny.net/" target="_blank" rel="noopener noreferrer">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://www.dicebear.com/sponsors/bunny-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://www.dicebear.com/sponsors/bunny-dark.svg">
        <img alt="bunny.net" src="https://www.dicebear.com/sponsors/bunny-dark.svg" height="64">
    </picture>
</a>
