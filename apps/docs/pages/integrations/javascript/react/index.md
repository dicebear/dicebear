---
title: React Avatar Library – DiceBear Integration
description: >
  Use DiceBear SVG avatars in React via JS library or avatar API. Generate
  deterministic profile pictures and user placeholder images in React apps.
---

# React avatar library: using DiceBear with React

DiceBear works in React via the JS library or the HTTP API. Use `useMemo` to
generate deterministic SVG profile pictures from a seed, or use the HTTP API as
a plain `<img src>` with no additional dependencies.

## With the JS library

```jsx
import { useMemo } from 'react';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export default function UserAvatar({ seed = 'Alice' }) {
  const avatar = useMemo(() => {
    return new Avatar(style, {
      seed,
      size: 128,
      // ... other options
    }).toDataUri();
  }, [seed]);

  return <img src={avatar} alt="Avatar" />;
}
```

## With the HTTP API

```jsx
import { useMemo } from 'react';

export default function Avatar({ seed = 'Alice' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/11.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    return url.href;
  }, [seed]);

  return <img src={avatar} alt="Avatar" />;
}
```
