---
title: HTTP-API
slug: /docs/http-api
---

Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.

    https://avatars.dicebear.com/api/:sprites/:seed.svg

Replace `:sprites` with `male`, `female`, `human`, `identicon`, `initials`, `bottts`, `avataaars`, `jdenticon`, `gridy`
or `micah`. The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here!

:::note  
We provide a large number of avatar styles from different designers. The designs are licensed under different licenses
that the designers can choose themselves. Some licenses require attribution. For a quick overview we have created an
[license overview](/licenses) for you.  
:::

## Options

Most [options](/docs/options) can be specified using the query string. Note that you have to encode the values.

The following URL for example sets a blue background:

    https://avatars.dicebear.com/api/male/john.svg?background=%230000ff

And this URL sets the `mood` option for the avatar style [male](/styles/male) to `happy` and `sad`:

    https://avatars.dicebear.com/api/male/john.svg?mood[]=happy&mood[]=sad

## Versioning

The API also supports versioning!

**Always use the latest version:**  
https://avatars.dicebear.com/api/:sprites/:seed.svg

**Use a specific version (4.6 for example):**  
https://avatars.dicebear.com/4.6/api/:sprites/:seed.svg

The last 10 minor versions are supported - starting with version 4.4.
