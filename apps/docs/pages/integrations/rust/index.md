---
title: Rust Avatar Library
description: >
  Use the DiceBear Rust library to generate SVG profile pictures on the server.
  Rust 1.80+ with an API identical to the JavaScript library.
---

# Rust avatar library

Generate avatars natively in Rust (1.80 or higher), with no external service
involved.

The API mirrors the [JavaScript library](/integrations/javascript/), and the
output is byte-identical: the same seed and style produce the same SVG in every
DiceBear library.

## Installation

You need two crates: the core library `dicebear-core` and the avatar style
definitions `dicebear-styles` (each style sits behind a feature of the same
name). Options are passed as a `serde_json::Value`, so add `serde_json` too.

```sh
cargo add dicebear-core serde_json
cargo add dicebear-styles --features lorelei
```

## Usage

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::LORELEI)?;

let avatar = Avatar::new(&style, json!({
    "seed": "John",
    // ... other options
}))?;

let svg = avatar.to_svg();
```

Every style has its own options, listed on its [style page](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Types

- `Style` is a validated, immutable wrapper around a style definition. Build it
  with `Style::from_str` from a JSON string or `Style::from_value` from a
  `serde_json::Value`, once, and reuse it for every avatar of that style.
- `Avatar::new` takes a `&Style` and a `serde_json::Value` of options and
  returns `Result<Avatar, Error>`. Invalid options and circular color references
  surface as an `Error`.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input: `OptionsDescriptor::new(&style).to_json()`. See
  [Style options](/customize/style-options/).

## Methods

| Method                      | Returns                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `to_svg()` or `to_string()` | The SVG as `&str` or `String`. `Avatar` implements `Display`, so `format!` and `println!` work too |
| `to_json()`                 | A `serde_json::Value` with the SVG under `svg` and the resolved options under `options`            |
| `to_data_uri()`             | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)                             |

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the options
in Rust syntax:

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "flip": "horizontal",            // "none", "horizontal", "vertical", "both"
    "rotate": 10,                    // -360 to 360, or [min, max] range
    "scale": 0.9,                    // 0 to 10 (1 = original), or [min, max] range
    "borderRadius": 50,              // 0-50 (50 = circle)
    "size": 128,
    "translateX": 0,                 // -1000 to 1000 (percent of canvas width)
    "translateY": 0,                 // -1000 to 1000 (percent of canvas height)
    "idRandomization": true,
    "title": "User Avatar",
    "fontFamily": "Arial",           // or ["Arial", "Helvetica"]
    "fontWeight": 700,               // 1-1000
    "backgroundColor": ["#b6e3f4", "#c0aede"],
    "backgroundColorFill": "solid",  // "solid", "linear", "radial"
}))?;
```

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Multiple avatars on the same page

When you inline several avatars into one page, use `idRandomization` to keep
their SVG IDs from colliding:

```rust
let avatars: Vec<String> = ["alice", "bob", "charlie"]
    .iter()
    .map(|seed| {
        Avatar::new(&style, json!({ "seed": seed, "idRandomization": true }))
            .map(|a| a.to_svg().to_string())
    })
    .collect::<Result<_, _>>()?;
```

### Weighted variant selection

A weight map makes some variants more likely than others. Here one in five
[critters](/styles/critters/) has a single eye:

```rust
// cargo add dicebear-styles --features critters
let style = Style::from_str(dicebear_styles::CRITTERS)?;

let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "eyesVariant": { "round": 4, "mono": 1 },
}))?;
```
