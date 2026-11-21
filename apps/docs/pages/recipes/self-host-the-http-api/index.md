---
title: Self-Hosted Avatar API – Host DiceBear Yourself
description: >
  Self-host the DiceBear avatar API for privacy-by-design and commercial use.
  Docker and Node.js deployment options available.
---

# Self-hosted avatar API: host DiceBear yourself

The public HTTP API is free and needs no signup, and for most projects that is
all you ever use. Hosting it yourself becomes interesting when avatar requests
should stay on your own infrastructure, be it for data control, for your own
rate limits, or because your app runs in a closed network. The source code is on
[GitHub](https://github.com/dicebear/api).

## With Docker

The easiest way is the [Docker image](https://hub.docker.com/r/dicebear/api):

```sh
docker run --tmpfs /run --tmpfs /tmp -p 3000:3000 -i -t dicebear/api:4
```

Or configure it in a `docker-compose.yml` and start it with `docker compose up`:

```yaml
services:
  dicebear:
    image: dicebear/api:4
    restart: always
    ports:
      - '3000:3000'
    tmpfs:
      - '/run'
      - '/tmp'
```

## Without Docker

You can also run the HTTP API directly on your machine with
[Node.js](https://nodejs.org/):

```sh
git clone git@github.com:dicebear/api.git
cd api

npm install
npm run build
npm start
```

## Optional style metadata endpoints

Your instance can expose two metadata endpoints per style. Both are off by
default, and an environment variable turns each one on:

```http
http://localhost:3000/11.x/<styleName>/definition.json
http://localhost:3000/11.x/<styleName>/options.json
```

- `definition.json` returns the raw
  [style definition](/create-styles/from-scratch/), the same JSON the styles
  package ships. Enable it with `DEFINITION=1`.
- `options.json` describes all options the style accepts: field types, allowed
  enum values, and value ranges. It leaves out the options in
  `EXCLUDED_OPTIONS`, so it always matches what your instance accepts. Enable it
  with `OPTIONS=1`.

Both responses are cached according to `CACHE_CONTROL_STYLES`.

## Signed URLs

By default, anyone who can reach your instance can request any avatar. Set
`SIGNING_SECRETS` and the avatar endpoints answer an unsigned or wrongly signed
URL with a `403`. Requests the API turns down before it gets to the signature
keep their usual answer, such as a `404` for an unknown style or a `400` for too
many parameters. The health check, the style listing and the metadata endpoints
stay open.

The signature is the HMAC-SHA256 of the path and query string, hex encoded and
appended as the `sig` parameter. Encode each value before you sign, because the
browser sends `Zoë` as `Zo%C3%AB` and the API checks the encoded form. List
values stay separated by plain commas:

```js
import { createHmac } from 'node:crypto';

// Browsers send ' in a query string as %27, encodeURIComponent leaves it.
const encode = (value) => encodeURIComponent(value).replace(/'/g, '%27');

function signedAvatarUrl(path, options, secret) {
  const query = Object.entries(options)
    .map(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];

      return `${key}=${values.map(encode).join(',')}`;
    })
    .join('&');

  const url = query ? `${path}?${query}` : path;
  const sig = createHmac('sha256', secret).update(url).digest('hex');

  return `${url}${query ? '&' : '?'}sig=${sig}`;
}

signedAvatarUrl(
  '/11.x/thumbs/svg',
  { seed: 'Zoë', backgroundColor: ['b6e3f4', 'c0aede'] },
  '0123456789abcdef0123456789abcdef',
);
// /11.x/thumbs/svg?seed=Zo%C3%AB&backgroundColor=b6e3f4,c0aede&sig=e5e07a3e3f33f3eb6973e0492f767aee9d946e07d2d2631aed94130c56c04d05
```

- With the options in the query string, the API checks the URL exactly as it
  arrives. `sig` has to be the last parameter, in lowercase hex, and everything
  in front of it is the signed string. If a proxy in front of the API rewrites
  the path, sign the path the API receives.
- URLs that carry the options in the path, as in the
  [Gravatar recipe](/recipes/gravatar-default-image/), keep `sig` and `exp` in
  that path segment too, because Gravatar drops a query string. Sign the path
  with its options before you encode the segment, for example
  `/11.x/lorelei/png/seed=Zo%C3%AB&exp=1794850233`. Then append `&sig=…` and
  encode the segment as a whole. Such a URL must not have a query string. With
  one, even a correctly signed URL gets a `403` with
  `Query string not allowed next to path options.`
- A `#` in a value has to arrive as `%23`. `encodeURIComponent` does that for
  you. A URL with a raw `#` gets a `403`.
- Every secret needs at least 32 characters, and the API refuses to start with a
  shorter one. `openssl rand -hex 32` generates a random one. A short or
  guessable secret can be found by trial and error from a single signed URL.
- An optional `exp` parameter holds a Unix timestamp in seconds. From that
  moment on the URL returns a `403`. Add it next to the other options before
  signing, so the signature covers it. The `max-age` in `Cache-Control` is
  capped at the time that remains.
- `exp` must appear once and hold 1 to 10 digits. `Date.now()` returns
  milliseconds, so divide by 1000. A repeated `exp` or one in another format
  gets a `403` with `Invalid expiry.`
- `SIGNING_SECRETS` takes several secrets separated by commas, with spaces
  around each one trimmed, so a secret cannot contain a comma. Without the
  variable, or with an empty one, the API runs without signed URLs.
- The API accepts a signature made with any of the secrets. To rotate, add the
  new secret, switch your application to it and remove the old one once its URLs
  are no longer in use.
- Removing a secret does not purge responses that a CDN or a browser has already
  cached.
- Sign on your server. A secret that ships to a browser or a mobile app can be
  read by anyone.

## Environment variables

| Variable                           | Default                                       | Description                                                          |
| ---------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `PORT`                             | `3000`                                        | Port to listen on.                                                   |
| `HOST`                             | `0.0.0.0`                                     | Host to bind to (all IPv4 addresses by default).                     |
| `LOGGER`                           | `0`                                           | Enable request logger (1 = on, 0 = off).                             |
| `WORKERS`                          | `1`                                           | Number of Node.js worker threads.                                    |
| `VERSIONS`                         | `10,11`                                       | Comma-separated list of supported DiceBear major versions.           |
| `CACHE_CONTROL_AVATARS`            | `31536000`                                    | Cache duration for avatar responses in seconds (1 year).             |
| `CACHE_CONTROL_STYLES`             | `3600`                                        | Cache duration for the styles listing in seconds (1 hour).           |
| `{FORMAT}`                         | `1`                                           | Enable the endpoint of this raster format (1 = on, 0 = off).         |
| `{FORMAT}_SIZE_MIN`                | `1`                                           | Minimum allowed size in px.                                          |
| `{FORMAT}_SIZE_MAX`                | `256`                                         | Maximum allowed size in px.                                          |
| `{FORMAT}_SIZE_DEFAULT`            | `128`                                         | Default size in px.                                                  |
| `{FORMAT}_EXIF`                    | `1`                                           | Enable Exif metadata (1 = on, 0 = off).                              |
| `JSON`                             | `1`                                           | Enable the JSON endpoint (1 = on, 0 = off).                          |
| `DEFINITION`                       | `0`                                           | Enable the per-style `definition.json` endpoint (1 = on, 0 = off).   |
| `OPTIONS`                          | `0`                                           | Enable the per-style `options.json` endpoint (1 = on, 0 = off).      |
| `INITIALS_FILTER`                  | `1`                                           | Replace blocked text in rendered avatars with `*` (1 = on, 0 = off). |
| `QUERY_STRING_ARRAY_LIMIT_MIN`     | `20`                                          | Minimum number of values allowed per array parameter.                |
| `EXCLUDED_OPTIONS`                 | `idRandomization,fontFamily,fontWeight,title` | Comma-separated list of option names to exclude.                     |
| `QUERY_STRING_PARAMETER_LIMIT_MIN` | `100`                                         | Minimum number of query string parameters allowed.                   |
| `SIGNING_SECRETS`                  |                                               | Comma-separated secrets for [signed URLs](#signed-urls).             |

`{FORMAT}` stands for `PNG`, `JPEG`, `WEBP`, or `AVIF`, so `PNG_SIZE_MAX` sets
the largest PNG and `AVIF=0` turns the AVIF endpoint off.
