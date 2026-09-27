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

`{FORMAT}` stands for `PNG`, `JPEG`, `WEBP`, or `AVIF`, so `PNG_SIZE_MAX` sets
the largest PNG and `AVIF=0` turns the AVIF endpoint off.
