---
title: DiceBear for AI Assistants and LLMs
description: >
  Make coding assistants write current DiceBear code: a rules block for your
  project, llms.txt, a Markdown version of every page, and JSON option
  descriptors for every avatar style.
---

# DiceBear for AI assistants

Coding assistants write DiceBear from memory, and that memory mostly predates
version 10. Six of the seven libraries shipped during 2026, outside most
training data, so without help an assistant will tell you there is no DiceBear
library for your language and hand you JavaScript.

## Rules for your project

Assistants read a rules file from the repository they work in, usually
`AGENTS.md`. Paste this block into it, and the assistant knows the current
package for your language, the shape of the API, and where to look up options:

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

## Machine-readable sources

| Address                                  | Contents                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `https://www.dicebear.com/llms.txt`      | Index of the documentation, current package versions, and every avatar style                        |
| `https://www.dicebear.com/llms-full.txt` | Every page in one file: guides first, then all styles with their option tables (about one megabyte) |
| Any page URL plus `index.md`             | That single page as Markdown                                                                        |

The Markdown version of a page sits next to its HTML, and each page links to it
from the header:

```http
https://www.dicebear.com/integrations/http-api/index.md
```

Option names are what assistants invent most often, and the API answers that
question directly, without a page to parse:

```http
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

Both behaviors are on purpose: old versions stay available, and dropping unknown
parameters keeps a URL from breaking when a style changes. They only turn into a
problem when code is written from memory, which is why the block lists the
pairs.

:::

::: details What changed in 11.0.0

The animated styles describe their motion in the definition, and the core plays
it through the `animation` option: `true` plays every animation of a style,
`${name}Animation` switches one of them by name, `animationSpeed` or
`${name}AnimationSpeed` set the pace, and `animationDelay` or
`${name}AnimationDelay` shift the start. The `animationVariant` option and the
`animation` tag from 10.x are gone. Passing them renders the static avatar.
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
their crawlers and only excludes the site notice. The documentation is
[MIT licensed](https://github.com/dicebear/dicebear/blob/11.x/LICENSE). The
avatar styles are not, and each one carries [its own license](/licenses/).
