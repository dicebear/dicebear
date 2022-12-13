---
title: HTTP-API
slug: /docs/http-api
---

Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.

    https://avatars.dicebear.com/api/<style>/<seed>.svg

Replace `<style>` with `adventurer`, `adventurer-neutral`, `avataaars`, `big-ears`, `big-ears-neutral`, `big-smile`,
`bottts`, `croodles`, `croodles-neutral`, `identicon`, `initials`, `micah`, `miniavs`, `open-peeps`, `personas`,
`pixel-art` or `pixel-art-neutral`. The value of `<seed>` can be anything you like - but **don't** use any sensitive or
personal data here!

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
https://avatars.dicebear.com/api/<style>/:seed.svg

**Use a specific version (4.6 for example):**  
https://avatars.dicebear.com/4.6/api/<style>/:seed.svg

Currently supported versions: `4.4`, `4.5`, `4.6`, `4.7`, `4.8`, `4.9` and `4.10`.
