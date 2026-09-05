<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear CLI</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/11.x/LICENSE)

Command-line interface for the DiceBear avatar library. Creates avatars from any
built-in or custom style as SVG, PNG, JPEG, WebP or AVIF, compresses definition
files, and compares two versions of a style.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/integrations/cli/)

## Installation

```sh
npm install --global dicebear
```

Requires Node.js 22+.

## Usage

```sh
# Print one SVG avatar to stdout
dicebear create lorelei --seed "Alice"

# Write one PNG, the extension picks the format
dicebear create lorelei --seed "Alice" -o alice.png

# Write 10 PNG avatars into ./avatars
dicebear create lorelei -o ./avatars --count 10 --format png

# Compress a definition file in place
dicebear optimize my-style.json -o my-style.json

# Check whether a new version of a style still renders the same
dicebear compare my-style-v1.json my-style.json
```

Pass style options as flags (e.g. `--seed "Alice"`). Run
`dicebear create <style> --help` to list the options of a style.

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
