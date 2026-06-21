---
title: Rust Avatar Library
description: >
  Use the DiceBear Rust library to generate SVG profile pictures on the server.
  Rust 1.80+ with an API identical to the JavaScript library.
---

# Rust avatar library

The Rust library provides an API identical to the
[JavaScript library](/how-to-use/js-library/). It requires Rust 1.80 or higher.
The same seed and style definition produce SVGs byte-identical to the JavaScript
reference.

## Installation

You need two crates: the core library `dicebear-core` and the avatar style
definitions `dicebear-styles` (each style sits behind a feature of the same
name). Options are passed as a `serde_json::Value`, so add `serde_json` too.

```sh
cargo add dicebear-core serde_json
cargo add dicebear-styles --features lorelei
```

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/).

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

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

We provide a large number of avatar styles from different creators. The avatar
styles are licensed under different licenses that the creators can choose
themselves. For a quick overview we have created a
[license overview](/licenses/) for you.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
always produces the same avatar:

```rust
let avatar1 = Avatar::new(&style, json!({ "seed": "user-123" }))?;
let avatar2 = Avatar::new(&style, json!({ "seed": "user-123" }))?;

assert_eq!(avatar1.to_svg(), avatar2.to_svg());
```

## Types

### `Style`

A validated, immutable wrapper around a style definition. Build it once with
`Style::from_str` (from a JSON string) or `Style::from_value` (from a
`serde_json::Value`), then reuse it when generating multiple avatars.

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(definition_json)?;

let avatar1 = Avatar::new(&style, json!({ "seed": "Alice" }))?;
let avatar2 = Avatar::new(&style, json!({ "seed": "Bob" }))?;
```

### `Avatar`

The main type for generating avatars. `Avatar::new` takes a `&Style` and a
`serde_json::Value` of options, and returns `Result<Avatar, Error>` (invalid
options and circular color references surface as an `Error`).

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let avatar = Avatar::new(&style, json!({
    // ... options
}))?;
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```rust
use dicebear_core::{OptionsDescriptor, Style};

let descriptor = OptionsDescriptor::new(&style).to_json();
```

## Methods

### `to_svg()` / `to_string()`

**Return type:** `&str` / `String`

Returns the avatar as SVG in XML format. `Avatar` also implements `Display`, so
it can be used directly in string contexts (`format!`, `println!`,
`.to_string()`).

```rust
let avatar = Avatar::new(&style, json!({ "seed": "Alice" }))?;

let svg = avatar.to_svg();
// or
let svg = avatar.to_string();
```

### `to_json()`

**Return type:** `serde_json::Value` with keys `svg` and `options`

Returns a value with the SVG and the resolved options.

```rust
let avatar = Avatar::new(&style, json!({ "seed": "Alice" }))?;

let result = avatar.to_json();

// result["svg"]     → "<svg>...</svg>"
// result["options"] → { "seed": "Alice", ... }
```

### `to_data_uri()`

**Return type:** `String`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```rust
let avatar = Avatar::new(&style, json!({ "seed": "Alice" }))?;

let data_uri = avatar.to_data_uri();

// <img src="{data_uri}" alt="Avatar" />
```

## Core options

These options are the same across every DiceBear core. See
[Core options](/guides/core-options/) for the full reference. Here are the
options in Rust syntax:

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
[Dynamic component options](/guides/core-options/#dynamic-component-options)
for all available patterns.

## Examples

### Avatar with custom background

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "backgroundColor": ["#b6e3f4", "#c0aede", "#d1d4f9"],
}))?;
```

### Fixed size avatar

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::BOTTTS)?;

let avatar = Avatar::new(&style, json!({
    "seed": "robot-42",
    "size": 128,
    "borderRadius": 50, // circular avatar
}))?;
```

### Avatar with transformations

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::AVATAAARS)?;

let avatar = Avatar::new(&style, json!({
    "seed": "Jane",
    "flip": "horizontal",
    "rotate": 10,
    "scale": 0.9,
    "translateY": 5,
}))?;
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

```rust
let style = Style::from_str(dicebear_styles::LORELEI)?;

let avatars: Vec<String> = ["alice", "bob", "charlie"]
    .iter()
    .map(|seed| {
        Avatar::new(&style, json!({ "seed": seed, "idRandomization": true }))
            .map(|a| a.to_svg().to_string())
    })
    .collect::<Result<_, _>>()?;
```

### Weighted variant selection

```rust
let avatar = Avatar::new(&style, json!({
    "seed": "Alice",
    "topVariant": { "short01": 2, "short02": 2, "long01": 1 },
}))?;
```
