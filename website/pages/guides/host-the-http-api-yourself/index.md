# Host the HTTP API yourself

In this guide, we will show you how to host the HTTP API yourself. This is not
necessary for most users, but it can be useful in some cases.

You can find the source code for the HTTP API on
[GitHub](https://github.com/dicebear/api). The code is written in TypeScript and
uses the [Fastify](https://www.fastify.io/) framework.

## With docker

The easiest way to host the HTTP API yourself is to use the docker image. You
can find the image on [Docker Hub](https://hub.docker.com/r/dicebear/api).

```
docker run --read-only --tmpfs /run --tmpfs /tmp -p 3000:3000 -i -t dicebear/api:2
```

## Without docker

If you don't want to use docker, you can also run the HTTP API directly on your
machine. You need to have [Node.js](https://nodejs.org/) installed.

```
git clone git@github.com:dicebear/api.git
cd api

npm install
npm run build
npm start
```

## Environment variables

The HTTP API supports the following environment variables:

### PORT

The port on which the HTTP API should listen. Defaults to `3000`.

### HOST

The host on which the HTTP API should listen. Defaults to `0.0.0.0` (all IPv4
addresses). See
https://fastify.dev/docs/latest/Reference/Server#listentextresolver

### LOGGER

Enable the logger. Defaults to `0` (false).

### PNG

Enable the PNG endpoint. Defaults to `1` (true).

### PNG_SIZE_MIN

The minimum size for the PNG endpoint. Defaults to `1`.

### PNG_SIZE_MAX

The maximum size for the PNG endpoint. Defaults to `128`.

### PNG_SIZE_DEFAULT

The default size for the PNG endpoint. Defaults to `128`.

### PNG_EXIF

Enable EXIF data for the PNG endpoint. Defaults to `1` (true).

#### Requirements

- Perl (https://www.npmjs.com/package/exiftool-vendored#installation)
- procps
  (https://www.npmjs.com/package/exiftool-vendored#this-package-requires-procps)

### JPEG

Enable the JPEG endpoint. Defaults to `1` (true).

### JPEG_SIZE_MIN

The minimum size for the JPEG endpoint. Defaults to `1`.

### JPEG_SIZE_MAX

The maximum size for the JPEG endpoint. Defaults to `128`.

### JPEG_SIZE_DEFAULT

The default size for the JPEG endpoint. Defaults to `128`.

### JPEG_EXIF

Enable EXIF data for the JPEG endpoint. Defaults to `1` (true).

#### Requirements

- Perl (https://www.npmjs.com/package/exiftool-vendored#installation)
- procps
  (https://www.npmjs.com/package/exiftool-vendored#this-package-requires-procps)

### VERSIONS

Comma separated specification of desired DiceBear Major versions. Default to
`5,6,7,8`.

### CACHE_CONTROL_AVATARS

Cache duration for the avatars endpoint in seconds. Defaults to `31536000` (1
year).
