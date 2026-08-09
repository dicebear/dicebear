<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear CLI</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

Command-line interface for the DiceBear avatar library. Generates avatars from
any built-in or custom style and saves them as SVG, PNG, JPEG, WebP or AVIF.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/how-to-use/cli/)

## Installation

```sh
npm install --global dicebear
```

Requires Node.js 22+.

## Usage

```sh
# Generate one SVG avatar in the current directory
dicebear lorelei .

# Generate 10 PNG avatars in ./avatars
dicebear lorelei ./avatars --count 10 --format png
```

Pass style options as flags (e.g. `--seed "John Doe"`). Run `dicebear --help` to
list every style and its options.

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
