---
title: Contribute to the Library
description: >
  Learn how to contribute an avatar style, improve an existing one, or work on
  the DiceBear core packages.
---

# Contribute to the library

DiceBear is maintained across several repositories on GitHub. Each repo has its
own `CONTRIBUTING.md` with setup, scripts, testing, and release instructions.
Pick the one that matches what you want to work on.

## Avatar styles

New avatar styles and fixes to existing styles live in
[`dicebear/styles`](https://github.com/dicebear/styles). Most styles are
authored in Figma and exported with the
[DiceBear Studio](/create-styles/with-figma/) plugin, so the workflow there is
not the usual "edit a JSON file" loop.

- [`CONTRIBUTING.md`](https://github.com/dicebear/styles/blob/main/CONTRIBUTING.md)
  in `dicebear/styles`

## Core library, CLI, documentation, editor

The JavaScript, PHP, Python, Rust, Go, Dart and C# cores, the CLI, the VitePress
documentation (including the Playground), and the standalone editor all live in
the main [`dicebear/dicebear`](https://github.com/dicebear/dicebear) monorepo.
See:

- [`CONTRIBUTING.md`](https://github.com/dicebear/dicebear/blob/10.x/CONTRIBUTING.md)
  in `dicebear/dicebear`

It covers the monorepo layout, per-package workflow, cross-language parity tests
across the JavaScript, PHP, Python, Rust, Go, Dart and C# cores, and the release
process.

## JSON Schema

The schema for avatar style definitions and runtime options is versioned
separately in [`dicebear/schema`](https://github.com/dicebear/schema).

- [`CONTRIBUTING.md`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md)
  in `dicebear/schema`

## DiceBear Studio (Figma plugin)

The Figma plugin that produces new avatar style definitions lives in
[`dicebear/studio`](https://github.com/dicebear/studio).

- [`CONTRIBUTING.md`](https://github.com/dicebear/studio/blob/main/CONTRIBUTING.md)
  in `dicebear/studio`
