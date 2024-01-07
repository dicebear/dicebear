---
title: What is DiceBear?
description: >
  With DiceBear you can create awesome avatars in no time. No matter what you
  are looking for, you will find something suitable among our avatar styles.
---

# Introduction

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
[Figma plugin](https://www.figma.com/community/plugin/1005765655729342787/DiceBear-Exporter),
[Editor](https://editor.dicebear.com) and [Playground](/playground/), your next
avatar is always just a stone's throw away!

## How to use?

You are a designer and need avatars for your design? Then check out our
[Figma Plugin](https://www.figma.com/community/plugin/1005765655729342787/DiceBear-Exporter)
and [Editor](https://editor.dicebear.com). As a developer, you could take a look
at the [HTTP API](/how-to-use/http-api/), the [CLI](/how-to-use/cli/), the
[JS library](/how-to-use/js-library/) or the [Playground](/playground/). Which
is more appropriate for you, depends on the programming language and environment
you are using.

In a JavaScript environment, you could use the JS library or the HTTP API if the
JS library is too large for you. In other environments you might be interested
in the HTTP API or the CLI if you are concerned about the stability or latency
of the HTTP API.

The CLI is always a good choice for automations or if you want to create a large
number of avatars in different image formats.

## How does it work?

The avatars are created in
[SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) format. This
allows to generate avatars dynamically without much computing power. In most
cases, various SVG elements such as hair, eyes, ears etc. are selected from a
set and combined to create a character / avatar.

[XorShift32](https://en.wikipedia.org/wiki/Xorshift) is used as the algorithm
for the [PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator). It
is important to note that the PNGR **does not** attempt to be
[cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator).
