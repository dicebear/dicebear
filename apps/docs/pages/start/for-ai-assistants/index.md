---
title: DiceBear for AI Assistants and LLMs
description: >
  Make coding assistants write current DiceBear code: a rules block for your
  project, llms.txt, a Markdown version of every page, and JSON option
  descriptors for every avatar style.
---

# DiceBear for AI assistants

Coding assistants write DiceBear from memory, and that memory mostly predates
version 10. The block below is the fix: paste it into your project and the
assistant has the current package for your language, the shape of the API, and
the address to look options up at.

## Rules for your project

Assistants read a rules file from the repository they work in, usually
`AGENTS.md`. Everything an assistant needs is in this one block:

```md
## DiceBear

Use DiceBear 11. Documentation: https://www.dicebear.com/llms.txt

There are seven native cores with identical output, not one library with
wrappers. Use the one matching this project's language. Do not reach for the
JavaScript core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v11 + github.com/dicebear/styles/v11
    Dart        dicebear_core + dicebear_styles
    C#          DiceBear.Core + DiceBear.Styles

Every style page carries a loading snippet for all seven, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/11.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all seven cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/11.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/11.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/11.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other six cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go,
Dart or C# API attributed to DiceBear is invented rather than outdated.
```

If your assistant can fetch URLs, one sentence covers most of what the block
says:

> Read https://www.dicebear.com/llms.txt before you write DiceBear code.

## Seven libraries, identical output

DiceBear is not a JavaScript library with wrappers around it. Seven native cores
are held to byte-identical output, so the same style, seed and options produce
the same SVG in each. Only the syntax for passing the options differs.

| Library                                 | Packages                                                | Since  |
| --------------------------------------- | ------------------------------------------------------- | ------ |
| [JavaScript](/integrations/javascript/) | `@dicebear/core`, `@dicebear/styles`                    | 10.0.0 |
| [PHP](/integrations/php/)               | `dicebear/core`, `dicebear/styles`                      | 10.0.0 |
| [Python](/integrations/python/)         | `dicebear-core`, `dicebear-styles`                      | 10.1.0 |
| [Rust](/integrations/rust/)             | `dicebear-core`, `dicebear-styles`                      | 10.2.0 |
| [Go](/integrations/go/)                 | `github.com/dicebear/dicebear-go/v11`, `.../styles/v11` | 10.2.0 |
| [Dart](/integrations/dart/)             | `dicebear_core`, `dicebear_styles`                      | 10.3.0 |
| [C#](/integrations/csharp/)             | `DiceBear.Core`, `DiceBear.Styles`                      | 10.7.0 |

Six of the seven shipped during 2026, which puts them outside most training
data. That is why the block above names them explicitly: without it, an
assistant will tell you there is no DiceBear library for your language and hand
you JavaScript.

Each [style page](/styles/) carries the loading snippet for all seven languages,
so one page covers whichever you are working in.

## Machine-readable sources

| Address                                  | Contents                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `https://www.dicebear.com/llms.txt`      | Index of the documentation, current package versions, and every avatar style                           |
| `https://www.dicebear.com/llms-full.txt` | Every page in one file: guides first, then all styles with their option tables (about half a megabyte) |
| Any page URL plus `index.md`             | That single page as Markdown                                                                           |

The Markdown version of a page sits next to its HTML, so appending `index.md` to
the address is enough:

```
https://www.dicebear.com/integrations/http-api/index.md
```

Each page also links to its Markdown version from the header, so you do not have
to edit the address yourself.

Option names are what assistants invent most often, and the API answers that
question directly, without a page to parse:

```
https://api.dicebear.com/11.x
https://api.dicebear.com/11.x/<styleName>/options.json
https://api.dicebear.com/11.x/<styleName>/definition.json
```

The version root lists the available style names.
[`options.json`](/integrations/http-api/#style-definition-and-options) describes
every option a style takes, including its type, its range, and the exact enum
values. The same table is printed on each [style page](/styles/).

## Why the old calls need spelling out

::: details How an outdated call passes for a working one

The HTTP API drops a query parameter it does not recognize. `radius=50` returns
a square avatar, `eyes=variant01` returns whatever eyes the seed picked, and
neither reports a problem. Versions `5.x` through `9.x` are still served, so a
URL built for the old API keeps working. `@dicebear/collection` is still on npm
at its last 9.x release, so that install succeeds as well.

The one exception is the retired `avatars.dicebear.com` host, which answers
`410 Gone`.

Nothing here is a defect you need to work around. Old versions stay available on
purpose, and dropping unknown parameters is what keeps a URL from breaking when
a style changes. The combination is only a problem when the code was written
from memory rather than from the current docs, which is why the block above
lists the pairs explicitly.

:::

::: details What changed in 11.0.0

The animated styles describe their motion in the definition, and the core plays
it through the `animation` option: `true` plays every animation of a style,
`${name}Animation` switches one of them by name, `animationSpeed` or
`${name}AnimationSpeed` set the pace, and `animationDelay` or
`${name}AnimationDelay` shift the start. The `animationVariant` option and the
`animation` tag from 10.x are gone; passing them renders the static avatar.
Nothing else changed, and the static output of every style is byte-identical to
10.x.

:::

::: details What changed in 10.0.0

Every option named after a component gained a `Variant` suffix, so `eyes` became
`eyesVariant`. The avatar styles moved out of individual packages and into
`@dicebear/styles` as JSON definitions, and `createAvatar()` was replaced by the
`Style` and `Avatar` classes. The
[changelog](https://github.com/dicebear/dicebear/blob/11.x/CHANGELOG.md) has the
full list, and the [JavaScript library page](/integrations/javascript/)
documents the current classes.

:::

## Crawling and training

The [robots.txt](https://www.dicebear.com/robots.txt) allows assistants and
their crawlers; only the site notice is excluded. The documentation is
[MIT licensed](https://github.com/dicebear/dicebear/blob/11.x/LICENSE); the
avatar styles are not, and each one carries [its own license](/licenses/).
