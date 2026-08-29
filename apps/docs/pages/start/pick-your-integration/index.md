---
title: Pick Your Integration – DiceBear
description: >
  HTTP API, library, CLI, or Editor? Find the right way to use DiceBear in
  your project based on what you're building.
---

<script setup>
import { Globe, Code2, Terminal, Palette } from '@lucide/vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';

const highlights = [
  {
    icon: Globe,
    title: 'HTTP API',
    description:
      'One URL in an img tag, nothing to install. The fastest route, and enough for most apps.',
    color: '#22c55e',
    link: '/integrations/http-api/',
  },
  {
    icon: Code2,
    title: 'A library',
    description:
      'Avatars generated in your own code, in seven languages. No external requests, works offline.',
    color: '#1689cc',
    link: '/integrations/javascript/',
  },
  {
    icon: Terminal,
    title: 'CLI',
    description:
      'Export avatars as files from the command line, including PNG, JPEG, and WebP. Made for batch jobs.',
    color: '#f59e0b',
    link: '/integrations/cli/',
  },
  {
    icon: Palette,
    title: 'Editor',
    description:
      'Click an avatar together in the browser and download it. No code involved.',
    color: '#ec4899',
    link: 'https://editor.dicebear.com',
  },
];
</script>

# Pick your integration

DiceBear runs as an API, as a library in seven languages, as a CLI, and as a
browser-based editor. They all produce identical avatars from the same seed,
so this is not a decision you can get wrong, and you can switch later without
your avatars changing. It's only a question of what fits your project best.

Three questions narrow it down:

**Can you point an `<img>` tag at a URL?** Then the
[HTTP API](/integrations/http-api/) is the shortest path. It's free, needs no
installation, and works from any language and platform.

**Do you want avatars generated on your own infrastructure?** Use a library.
Your user data stays on your systems and there's no external request per
avatar. Pick your language below.

**Do you need image files rather than running code?** The
[CLI](/integrations/cli/) exports batches to SVG, PNG, JPEG, and more. And for a
single avatar, say a default profile picture for your app, the
[Editor](https://editor.dicebear.com) is the no-code way.

<DocsHighlights :highlights="highlights" />

## The libraries

| Language   | Package(s)                            | Guide                                     |
| ---------- | ------------------------------------- | ----------------------------------------- |
| JavaScript | `@dicebear/core` + `@dicebear/styles` | [JS library](/integrations/javascript/)     |
| PHP        | `dicebear/core` + `dicebear/styles`   | [PHP library](/integrations/php/)   |
| Python     | `dicebear-core` + `dicebear-styles`   | [Python library](/integrations/python/) |
| Rust       | `dicebear-core` + `dicebear-styles`   | [Rust library](/integrations/rust/) |
| Go         | `dicebear/dicebear-go` + `dicebear/styles` | [Go library](/integrations/go/)     |
| Dart       | `dicebear_core` + `dicebear_styles`   | [Dart library](/integrations/dart/) |
| C#         | `DiceBear.Core` + `DiceBear.Styles`   | [C# library](/integrations/csharp/) |

Frameworks build on these: guides exist for
[React](/integrations/javascript/react/),
[React Native](/integrations/javascript/react-native/),
[Vue](/integrations/javascript/vue/),
[Svelte](/integrations/javascript/svelte/),
[Angular](/integrations/javascript/angular/),
[Next.js](/integrations/javascript/next-js/),
[Nuxt](/integrations/javascript/nuxt/),
[Flutter](/integrations/dart/flutter/),
[Unity](/integrations/csharp/unity/), and
[Godot](/integrations/csharp/godot/).

## Still unsure?

Start with the [HTTP API](/integrations/http-api/). It requires the least setup,
and because every integration renders the same avatars, moving to a library
later is a refactor, not a redesign.
