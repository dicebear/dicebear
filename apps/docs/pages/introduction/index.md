---
title: DiceBear – Open Source Avatar Library & API
description: >
  DiceBear is a free, open source avatar library and avatar API. Generate
  deterministic SVG profile pictures and user placeholder images via JavaScript
  library, PHP library, Python library, Rust library, Go library, Dart library,
  HTTP API, or CLI.
---

<script setup>
import { Palette, Code2, Globe, Terminal, Server, Library, Boxes, Hexagon, Target } from '@lucide/vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';

const highlights = [
  {
    icon: Globe,
    title: 'HTTP API',
    description:
      'Use a simple URL to embed avatars in any language or platform without installing anything.',
    color: '#22c55e',
    link: '/how-to-use/http-api/',
  },
  {
    icon: Code2,
    title: 'JS Library',
    description:
      'Generate avatars in the browser or Node.js with full TypeScript support. Great for React, Vue, Svelte, and more.',
    color: '#1689cc',
    link: '/how-to-use/js-library/',
  },
  {
    icon: Server,
    title: 'PHP Library',
    description:
      'Generate avatars on the server with PHP 8.2+. Identical API to the JS library: same seed, same result.',
    color: '#8b5cf6',
    link: '/how-to-use/php-library/',
  },
  {
    icon: Library,
    title: 'Python Library',
    description:
      'Generate avatars on the server with Python 3.10+. Identical API to the JS library: same seed, same result.',
    color: '#3b82f6',
    link: '/how-to-use/python-library/',
  },
  {
    icon: Boxes,
    title: 'Rust Library',
    description:
      'Generate avatars on the server with Rust 1.80+. Identical API to the JS library: same seed, same result.',
    color: '#14b8a6',
    link: '/how-to-use/rust-library/',
  },
  {
    icon: Hexagon,
    title: 'Go Library',
    description:
      'Generate avatars on the server with Go 1.23+. Identical API to the JS library: same seed, same result.',
    color: '#00add8',
    link: '/how-to-use/go-library/',
  },
  {
    icon: Target,
    title: 'Dart Library',
    description:
      'Generate avatars in Dart and Flutter apps with Dart 3.4+. Identical API to the JS library: same seed, same result.',
    color: '#0175c2',
    link: '/how-to-use/dart-library/',
  },
  {
    icon: Terminal,
    title: 'CLI',
    description:
      'Perfect for automations and batch exports in multiple image formats directly from the command line.',
    color: '#f59e0b',
    link: '/how-to-use/cli/',
  },
  {
    icon: Palette,
    title: 'Editor',
    description:
      'Use the interactive Editor to browse all avatar styles, customize options, and export avatars without writing any code.',
    color: '#ec4899',
    link: 'https://editor.dicebear.com',
  },
];
</script>

# DiceBear: open source avatar library & API

## What is DiceBear?

DiceBear generates avatars for your project. The avatar styles cover a range of
looks, from abstract shapes to designed characters, and the avatars can be used
in many kinds of applications.

In addition to purely random avatars, you can also create
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) avatars
for user identities. With the built-in
[PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) you create
the same avatar over and over again based on a seed. Individual avatars are also
possible: each avatar style provides many options to adjust the result.

DiceBear is available through the [JavaScript library](/how-to-use/js-library/),
[PHP library](/how-to-use/php-library/),
[Python library](/how-to-use/python-library/),
[Rust library](/how-to-use/rust-library/),
[Go library](/how-to-use/go-library/),
[Dart library](/how-to-use/dart-library/), [HTTP API](/how-to-use/http-api/),
[CLI](/how-to-use/cli/),
[Figma plugin](https://www.figma.com/community/plugin/1005765655729342787/DiceBear-Exporter),
[Editor](https://editor.dicebear.com) and [Playground](/playground/), so you can
integrate it into most projects. The [Avatar API](/how-to-use/http-api/)
provides URL-based integration without installing anything.

## How to use?

<DocsHighlights :highlights="highlights" />

## How does it work?

The avatars are created in
[SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) format. This
allows to generate avatars dynamically without much computing power. In most
cases, various SVG elements such as hair, eyes, ears etc. are selected from a
set and combined to create a character / avatar.

[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
combined with
[Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c)
is used as the algorithm for the
[PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator). The PRNG
**does not** attempt to be
[cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator).

## Privacy by design

DiceBear is built with privacy in mind. When using the
[JavaScript library](/how-to-use/js-library/),
[PHP library](/how-to-use/php-library/),
[Python library](/how-to-use/python-library/),
[Rust library](/how-to-use/rust-library/), [Go library](/how-to-use/go-library/)
or [Dart library](/how-to-use/dart-library/), avatars are generated entirely on
your infrastructure. No personal data ever leaves your systems. For teams that
require full control over data retention and infrastructure, DiceBear can be
[self-hosted](/guides/host-the-http-api-yourself/), so there is no dependency on
external services.
