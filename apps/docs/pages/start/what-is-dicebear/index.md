---
title: What is DiceBear? – Open Source Avatar Library & API
description: >
  DiceBear is a free, open source avatar library. Generate deterministic SVG
  avatars from a seed, customize them with options, and use them via library,
  HTTP API, or CLI.
---

# What is DiceBear?

DiceBear generates avatars. You give it a seed, it gives you an SVG image, and
the same seed always returns the same image. That one property makes it useful
for user profiles: use the username or user ID as the seed and every person in
your app has a consistent avatar without ever uploading a picture.

The look comes from [avatar styles](/styles/). There are %STYLE_COUNT% of them,
drawn by different artists, ranging from abstract shapes to illustrated
characters and robots. That collection is what sets DiceBear apart: no other
avatar library has one like it, and all of it is one word in your code or URL
away. Every style has options such as background color, flip, or scale, and most
add their own, like hair, eyes, or accessories. So an avatar is the answer to
three questions: which style, which seed, which options. Curious what happens
under the hood? [How avatars are made](/understand/how-avatars-are-made/) walks
through it.

## Where it runs

Anywhere, in practice. Libraries for JavaScript, PHP, Python, Rust, Go, Dart,
and C# generate avatars directly in your code. The free HTTP API serves them by
URL for everything else. A CLI covers batch exports, and the
[Editor](https://editor.dicebear.com) works without any code at all. The
[integration picker](/start/pick-your-integration/) helps you choose. Whatever
you pick, results match: the seed `Alice` renders the same avatar in every
library and on the API.

## Privacy

The libraries generate avatars entirely on your infrastructure, so no data about
your users leaves your systems. If you want the URL-based workflow with the same
control, the HTTP API is open source and
[self-hostable](/recipes/self-host-the-http-api/).

## Free and open source

The DiceBear code is MIT licensed. The avatar styles carry licenses chosen by
their artists, and the [license overview](/licenses/) shows all of them in one
place.
