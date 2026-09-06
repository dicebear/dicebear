---
title: DiceBear – Open Source Avatar Library & API
description: >
  DiceBear is a free, open source avatar library and avatar API. Generate
  deterministic SVG profile pictures and user placeholder images via
  JavaScript library, HTTP API, or CLI.
---

<script setup>
import { Palette, Code2, Globe, Terminal } from 'lucide-vue-next';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';

const highlights = [
  {
    icon: Globe,
    title: 'HTTP API',
    description:
      'Use a simple URL to embed avatars in any language or platform — no installation needed.',
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
    icon: Terminal,
    title: 'CLI',
    description:
      'Perfect for automations and batch exports in multiple image formats directly from the command line.',
    color: '#f59e0b',
    link: '/how-to-use/cli/',
  },
  {
    icon: Palette,
    title: 'Designer',
    description:
      'Use the interactive Editor to browse all avatar styles, customize options, and export avatars — no code required.',
    color: '#ec4899',
    link: 'https://editor.dicebear.com',
  },
];
</script>

# DiceBear – Open Source Avatar Library & API

## What is DiceBear?

With DiceBear you can create awesome avatars for your project in no time.
Whether you are looking for abstract shapes or lovingly designed characters, you
will find something suitable among our avatar styles. And no matter how and for
what you want to use the avatars, DiceBear offers the right solution!

In addition to purely random avatars, you can also create
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) avatars
for user identities. With the built-in
[PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) you create
the same avatar over and over again based on a seed. But also individual avatars
are possible! Just use the countless options that each avatar style provides.

And thanks to the [JavaScript library](/how-to-use/js-library/),
[HTTP API](/how-to-use/http-api/), [CLI](/how-to-use/cli/),
[plugin for Figma](https://www.figma.com/community/plugin/1005765655729342787/DiceBear-Exporter),
[Editor](https://editor.dicebear.com) and [Playground](/playground/), your next
avatar is always just a stone's throw away! Explore our [Avatar API](/how-to-use/http-api/) for simple URL-based integration.

## How to use?

<DocsHighlights :highlights="highlights" />

## How does it work?

The avatars are created in
[SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) format. This
allows to generate avatars dynamically without much computing power. In most
cases, various SVG elements such as hair, eyes, ears etc. are selected from a
set and combined to create a character / avatar.

[XorShift32](https://en.wikipedia.org/wiki/Xorshift) is used as the algorithm
for the [PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator). It
is important to note that the PRNG **does not** attempt to be
[cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator).

## Privacy-by-Design

DiceBear is built with privacy in mind. When using the
[JavaScript library](/how-to-use/js-library/), avatars are generated entirely
on the client — no personal data ever leaves the user's device. For teams that
require full control over data retention and infrastructure, DiceBear can be
[self-hosted](/guides/host-the-http-api-yourself/) — making it a
privacy-focused avatar solution with no dependency on external services.
