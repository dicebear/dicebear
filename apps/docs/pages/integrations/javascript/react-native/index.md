---
title: React Native Avatar Library – DiceBear
description: >
  Generate SVG user avatars in React Native using DiceBear. Integrate the
  JavaScript avatar library or avatar API into your mobile app.
---

# React Native avatar library: using DiceBear with React Native

DiceBear can be used in React Native via the JavaScript library with an SVG
renderer, or via the HTTP API's PNG format using the built-in `Image` component.
The API approach requires no SVG library.

## With the JS library

You need an SVG library to render the avatars. In our example we use the package
[react-native-svg](https://www.npmjs.com/package/react-native-svg).

```
npm install react-native-svg
```

```jsx
import { useMemo } from 'react';
import { View } from 'react-native';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import { SvgXml } from 'react-native-svg';

const style = new Style(lorelei);

export default function UserAvatar({ seed = 'Alice' }) {
  const avatar = useMemo(() => {
    return new Avatar(style, {
      seed,
      size: 128,
      // ... other options
    }).toString();
  }, [seed]);

  return (
    <View>
      <SvgXml xml={avatar} />
    </View>
  );
}
```

## With the HTTP API

With the HTTP API you can use the PNG format and the built-in `Image` component
without any additional dependencies.

```jsx
import { useMemo } from 'react';
import { Image, View } from 'react-native';

export default function Avatar({ seed = 'Alice' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/png');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    return url.href;
  }, [seed]);

  return (
    <View>
      <Image source={{ uri: avatar }} style={{ width: 128, height: 128 }} />
    </View>
  );
}
```
