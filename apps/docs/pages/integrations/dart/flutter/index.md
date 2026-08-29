---
title: Flutter Avatar Library
description: >
  Generate SVG profile pictures in Flutter with DiceBear. Render avatars on the
  device with the Dart library, or load PNGs from the HTTP API with no extra
  packages.
---

# Flutter avatar library: using DiceBear with Flutter

You can generate DiceBear avatars in Flutter two ways. Use the
[Dart library](/integrations/dart/) with an SVG renderer to build avatars
on the device, or use the [HTTP API](/integrations/http-api/) with Flutter's
built-in `Image.network` to load ready-made PNGs.

The HTTP API needs no extra packages and is the quickest to set up. The Dart
library keeps everything local, so it works offline and sends no requests.

## With the Dart library

Add the core library, the style definitions, and an SVG renderer. We use
[flutter_svg](https://pub.dev/packages/flutter_svg) to draw the SVG string.

```sh
flutter pub add dicebear_core dicebear_styles flutter_svg
```

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/lorelei.dart';

// Parse the style once and reuse it.
final style = Style.parse(lorelei);

class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, this.seed = 'Alice'});

  final String seed;

  @override
  Widget build(BuildContext context) {
    final avatar = Avatar(style, {
      'seed': seed,
      'size': 128,
      // ... other options
    });

    return SvgPicture.string(
      avatar.svg,
      width: 128,
      height: 128,
    );
  }
}
```

`Avatar(style, {...}).svg` returns the SVG as a string, which
`SvgPicture.string` renders directly. For the full API and the options each
style accepts, see the [Dart library reference](/integrations/dart/).

## With the HTTP API

The HTTP API returns finished images, so you need no extra packages. Request the
`png` format and pass the URL to `Image.network`.

```dart
import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, this.seed = 'Alice'});

  final String seed;

  @override
  Widget build(BuildContext context) {
    final url = Uri.https('api.dicebear.com', '/10.x/lorelei/png', {
      'seed': seed,
      'size': '128',
      // ... other options
    });

    return Image.network(
      url.toString(),
      width: 128,
      height: 128,
    );
  }
}
```

Every option is a query parameter. See the
[HTTP API reference](/integrations/http-api/) for the full list.
