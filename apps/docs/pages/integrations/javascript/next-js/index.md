---
title: Next.js Avatar Library – DiceBear Integration
description: >
  Use DiceBear SVG avatars in Next.js (App Router and Pages Router). Server
  component rendering, client component rendering, and image optimization
  patterns for deterministic profile pictures.
---

# Next.js avatar library: using DiceBear with Next.js

DiceBear works in every Next.js rendering mode: server components, client
components, and the Pages Router. Server-side generation is the default
recommendation because it produces zero JavaScript on the client and avoids
hydration pitfalls.

## App Router

### Server component (recommended)

In App Router, components are server components by default. Generate the SVG on
the server and inline it as a
[data URI](https://en.wikipedia.org/wiki/Data_URI_scheme), so the avatar needs
no client-side JavaScript.

```tsx
// app/components/UserAvatar.tsx
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const dataUri = new Avatar(style, {
    seed,
    size: 128,
    // ... other options
  }).toDataUri();

  return <img src={dataUri} alt="Avatar" width={128} height={128} />;
}
```

### Client component

Mark the file with `'use client'` and wrap generation in `useMemo` so the avatar
is only re-derived when the seed changes.

```tsx
// app/components/UserAvatarClient.tsx
'use client';

import { useMemo } from 'react';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export function UserAvatarClient({ seed = 'Alice' }: { seed?: string }) {
  const dataUri = useMemo(
    () =>
      new Avatar(style, {
        seed,
        size: 128,
        // ... other options
      }).toDataUri(),
    [seed],
  );

  return <img src={dataUri} alt="Avatar" width={128} height={128} />;
}
```

::: warning Hydration & `idRandomization`

`idRandomization` uses the host's non-seeded RNG, so the server and the client
will produce different IDs and React will throw a hydration mismatch warning.
Either:

- Generate the avatar in a server component (no hydration) and don't pass the
  SVG to a client component, **or**
- Leave `idRandomization: false` and rely on the deterministic IDs.

If you need ID uniqueness across multiple avatars on the same page, render each
avatar entirely on the server.

:::

### Route handler (avatar endpoint)

Expose DiceBear behind your own URL. This is useful for caching with custom
`Cache-Control` headers or for restricting which seeds are accepted.

```ts
// app/api/avatar/[seed]/route.ts
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ seed: string }> },
) {
  const { seed } = await params;

  const svg = new Avatar(style, { seed, size: 128 }).toString();

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
```

## Pages Router

Pages Router treats every component as client-side by default. Use `useMemo`
exactly like in a plain React app. See the
[React guide](/integrations/javascript/react/) for the canonical pattern.
Server-side generation through `getServerSideProps` or `getStaticProps` returns
the SVG as a prop, which avoids a client bundle hit.

```tsx
// pages/profile.tsx
import type { GetServerSideProps } from 'next';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

type Props = { avatar: string };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const avatar = new Avatar(style, { seed: 'Alice', size: 128 }).toDataUri();

  return { props: { avatar } };
};

export default function Profile({ avatar }: Props) {
  return <img src={avatar} alt="Avatar" width={128} height={128} />;
}
```

## With the HTTP API

The HTTP API needs no installation and works in both routers. Use a plain
`<img>` tag. Next.js does not pre-process external SVGs by default.

```tsx
export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const src = `https://api.dicebear.com/10.x/lorelei/svg?seed=${encodeURIComponent(seed)}&size=128`;

  return <img src={src} alt="Avatar" width={128} height={128} />;
}
```

If you want to use `next/image` with the HTTP API, request a raster format (PNG,
WebP, AVIF), since `next/image` does not optimize SVG sources, and add
`api.dicebear.com` to `images.remotePatterns` in `next.config.js`.

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.dicebear.com' }],
  },
};
```

```tsx
import Image from 'next/image';

export function UserAvatar({ seed = 'Alice' }: { seed?: string }) {
  const src = `https://api.dicebear.com/10.x/lorelei/png?seed=${encodeURIComponent(seed)}&size=128`;

  return <Image src={src} alt="Avatar" width={128} height={128} />;
}
```
