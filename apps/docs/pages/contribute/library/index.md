---
title: Contribute to the Library
description: >
  Learn how to contribute an avatar style, improve an existing one, or work on
  the DiceBear core packages.
---

# Contribute to the library

DiceBear is spread across several repositories on GitHub. Each one has its own
`CONTRIBUTING.md` with setup, scripts, testing, and release instructions, so
pick the one that matches what you want to work on.

## Avatar styles

New avatar styles and fixes to existing ones live in
[`dicebear/styles`](https://github.com/dicebear/styles), see its
[`CONTRIBUTING.md`](https://github.com/dicebear/styles/blob/main/CONTRIBUTING.md).
Most styles are drawn in Figma and exported with the
[DiceBear Studio](/create-styles/with-figma/) plugin, so the workflow there is
not the usual "edit a JSON file" loop.

## Core library, CLI, documentation, editor

The seven language cores, the CLI, the VitePress documentation (including the
Playground), and the standalone editor all live in the
[`dicebear/dicebear`](https://github.com/dicebear/dicebear) monorepo. Its
[`CONTRIBUTING.md`](https://github.com/dicebear/dicebear/blob/11.x/CONTRIBUTING.md)
covers the monorepo layout, the per-package workflow, the parity tests across
all cores, and the release process.

## JSON Schema

The schema for avatar style definitions and runtime options is versioned
separately in [`dicebear/schema`](https://github.com/dicebear/schema), see its
[`CONTRIBUTING.md`](https://github.com/dicebear/schema/blob/main/CONTRIBUTING.md).

## DiceBear Studio (plugin for Figma)

The plugin for Figma that produces new avatar style definitions lives in
[`dicebear/studio`](https://github.com/dicebear/studio), see its
[`CONTRIBUTING.md`](https://github.com/dicebear/studio/blob/main/CONTRIBUTING.md).
