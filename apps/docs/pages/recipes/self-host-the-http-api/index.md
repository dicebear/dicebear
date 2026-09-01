---
title: Self-Hosted Avatar API – Host DiceBear Yourself
description: >
  Self-host the DiceBear avatar API for privacy-by-design and commercial use.
  Docker and Node.js deployment options available.
---

# Self-hosted avatar API: host DiceBear yourself

The public HTTP API is free and needs no signup, and for most projects that is
all you ever use. Hosting it yourself becomes interesting when you want avatar
requests to stay on your own infrastructure, be it for data control, for your
own rate limits, or because your app runs in a closed network.

You can find the source code for the HTTP API on
[GitHub](https://github.com/dicebear/api). The code is written in TypeScript and
uses the [Fastify](https://www.fastify.io/) framework.

## With Docker

The easiest way to host the HTTP API yourself is to use the docker image. You
can find the image on [Docker Hub](https://hub.docker.com/r/dicebear/api).

```
docker run --tmpfs /run --tmpfs /tmp -p 3000:3000 -i -t dicebear/api:4
```

Or you can use `docker-compose.yml` to configure the HTTP API and start it with
"docker compose up".

```
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

If you don't want to use docker, you can also run the HTTP API directly on your
machine. You need to have [Node.js](https://nodejs.org/) installed.

```
git clone git@github.com:dicebear/api.git
cd api

npm install
npm run build
npm start
```

## Optional style metadata endpoints

Besides the avatar endpoints, your instance can expose two metadata endpoints
per style. Both are disabled by default and can be enabled individually with an
environment variable:

```
http://localhost:3000/11.x/<styleName>/definition.json
http://localhost:3000/11.x/<styleName>/options.json
```

- `definition.json` returns the raw
  [style definition](/create-styles/from-scratch/), the same JSON that is
  shipped with the style package. Enable it with `DEFINITION=1`.
- `options.json` returns a descriptor of all options the style accepts: field
  types, allowed enum values, and value ranges. Options listed in
  `EXCLUDED_OPTIONS` are omitted, so the response always matches what your
  instance actually accepts. Enable it with `OPTIONS=1`.

Both responses are cached according to `CACHE_CONTROL_STYLES`.

## Environment variables

The HTTP API supports the following environment variables:

| Variable                           | Default                                       | Description                                                          |
| ---------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `PORT`                             | `3000`                                        | Port to listen on.                                                   |
| `HOST`                             | `0.0.0.0`                                     | Host to bind to (all IPv4 addresses by default).                     |
| `LOGGER`                           | `0`                                           | Enable request logger (1 = on, 0 = off).                             |
| `WORKERS`                          | `1`                                           | Number of Node.js worker threads.                                    |
| `VERSIONS`                         | `10`                                          | Comma-separated list of supported DiceBear major versions.           |
| `CACHE_CONTROL_AVATARS`            | `31536000`                                    | Cache duration for avatar responses in seconds (1 year).             |
| `CACHE_CONTROL_STYLES`             | `3600`                                        | Cache duration for the styles listing in seconds (1 hour).           |
| `PNG`                              | `1`                                           | Enable the PNG endpoint (1 = on, 0 = off).                           |
| `PNG_SIZE_MIN`                     | `1`                                           | Minimum allowed PNG size in px.                                      |
| `PNG_SIZE_MAX`                     | `256`                                         | Maximum allowed PNG size in px.                                      |
| `PNG_SIZE_DEFAULT`                 | `128`                                         | Default PNG size in px.                                              |
| `PNG_EXIF`                         | `1`                                           | Enable EXIF metadata for PNG (1 = on, 0 = off).                      |
| `JPEG`                             | `1`                                           | Enable the JPEG endpoint (1 = on, 0 = off).                          |
| `JPEG_SIZE_MIN`                    | `1`                                           | Minimum allowed JPEG size in px.                                     |
| `JPEG_SIZE_MAX`                    | `256`                                         | Maximum allowed JPEG size in px.                                     |
| `JPEG_SIZE_DEFAULT`                | `128`                                         | Default JPEG size in px.                                             |
| `JPEG_EXIF`                        | `1`                                           | Enable EXIF metadata for JPEG (1 = on, 0 = off).                     |
| `WEBP`                             | `1`                                           | Enable the WebP endpoint (1 = on, 0 = off).                          |
| `WEBP_SIZE_MIN`                    | `1`                                           | Minimum allowed WebP size in px.                                     |
| `WEBP_SIZE_MAX`                    | `256`                                         | Maximum allowed WebP size in px.                                     |
| `WEBP_SIZE_DEFAULT`                | `128`                                         | Default WebP size in px.                                             |
| `WEBP_EXIF`                        | `1`                                           | Enable EXIF metadata for WebP (1 = on, 0 = off).                     |
| `AVIF`                             | `1`                                           | Enable the AVIF endpoint (1 = on, 0 = off).                          |
| `AVIF_SIZE_MIN`                    | `1`                                           | Minimum allowed AVIF size in px.                                     |
| `AVIF_SIZE_MAX`                    | `256`                                         | Maximum allowed AVIF size in px.                                     |
| `AVIF_SIZE_DEFAULT`                | `128`                                         | Default AVIF size in px.                                             |
| `AVIF_EXIF`                        | `1`                                           | Enable EXIF metadata for AVIF (1 = on, 0 = off).                     |
| `JSON`                             | `1`                                           | Enable the JSON endpoint (1 = on, 0 = off).                          |
| `DEFINITION`                       | `0`                                           | Enable the per-style `definition.json` endpoint (1 = on, 0 = off).   |
| `OPTIONS`                          | `0`                                           | Enable the per-style `options.json` endpoint (1 = on, 0 = off).      |
| `INITIALS_FILTER`                  | `1`                                           | Replace blocked text in rendered avatars with `*` (1 = on, 0 = off). |
| `QUERY_STRING_ARRAY_LIMIT_MIN`     | `20`                                          | Minimum number of values allowed per array parameter.                |
| `EXCLUDED_OPTIONS`                 | `idRandomization,fontFamily,fontWeight,title` | Comma-separated list of option names to exclude.                     |
| `QUERY_STRING_PARAMETER_LIMIT_MIN` | `100`                                         | Minimum number of query string parameters allowed.                   |
