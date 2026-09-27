---
title: What is DiceBear? – Open Source Avatar Library & API
description: >
  DiceBear is a free, open source avatar library. Generate deterministic SVG
  avatars from a seed, customize them with options, and use them via library,
  HTTP API, or CLI.
---

# What is DiceBear?

DiceBear generates avatars. You give it a seed, it gives you an SVG image, and
the same seed always returns the same image. Use the username or user ID as the
seed and every person in your app has a consistent avatar without ever uploading
a picture.

The look comes from %STYLE_COUNT% [avatar styles](/styles/) by different
artists, from abstract shapes to illustrated characters and robots. No other
avatar library has a collection like it, and switching styles is one word in
your code or URL. Options such as background color, hair, or accessories adjust
each style. [How avatars are made](/understand/how-avatars-are-made/) shows what
happens under the hood.

## Where it runs

Libraries for JavaScript, PHP, Python, Rust, Go, Dart, and C# generate avatars
in your own code. The free HTTP API serves them by URL, the CLI exports files in
batches, and the [Editor](https://editor.dicebear.com) needs no code at all. All
of them render the same avatar for the same seed. The
[integration picker](/start/pick-your-integration/) helps you choose.

## Privacy

The libraries generate avatars entirely on your infrastructure, so no data about
your users leaves your systems. The HTTP API is open source too, and you can
[host it yourself](/recipes/self-host-the-http-api/).

## Free and open source

The DiceBear code is MIT licensed. Each avatar style carries the license its
artist chose, and the [license overview](/licenses/) lists all of them.
