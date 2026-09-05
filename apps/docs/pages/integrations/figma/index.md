---
title: Figma Plugin – Avatars in Your Designs
description: >
  Fill placeholders with DiceBear avatars, insert batches of new ones, and hand
  seeds, API URLs and code to developers, all inside Figma.
---

# Figma plugin

[DiceBear Studio](https://www.figma.com/community/plugin/1005765655729342787)
puts DiceBear into Figma. It fills the avatar placeholders in your mockups with
real avatars, inserts batches of new ones, and tells developers how to render
the same avatar in the app.

::: tip Looking for something else?

This page is about avatars in your designs. The plugin has two more guides:

- You want to draw your own avatar style:
  [Create an avatar style with Figma](/create-styles/with-figma/)
- You want to change one of our styles:
  [Edit an avatar style with Figma](/create-styles/edit-a-style/)

:::

The plugin is free and works in the Figma desktop app and in the browser. Start
it from the Actions search in the toolbar, or from **Plugins** in the context
menu of the canvas.

The plugin has three tabs in the rail on the left. Generate and Inspect are for
designers who use avatars, Style is for creators of avatar styles.

## Fill layers with avatars

Select the layers that should show an avatar. Rectangles, ellipses, frames and
other shapes all work, and a selected group or frame is searched for such
layers. Each layer keeps its shape, corners and masks and gets the avatar as an
image fill.

![A chat mockup with five avatar placeholders selected, named after the people they show](/integrations/figma/1.webp)

Then start the plugin, for example from the Actions search.

![The Actions search in Figma with "dicebear studio" typed in and the plugin as the first result](/integrations/figma/2.webp)

The Generate tab opens on the style gallery, with every style of the DiceBear
collection. Pick one, and the tab shows a preview of the avatars the selected
layers will get.

The seeds decide which face each layer gets. The default draws a random name per
layer. Layer names use the name of each layer, so a placeholder called "Jane
Doe" always shows the same avatar, in every mockup. From a list takes one seed
per line, and Numbered builds seeds from a prefix and a counter.

![The Generate tab with the seed strategies: Random, Layer names, From a list, Numbered](/integrations/figma/3.webp)

Below the seeds you can pick which variants of each component the style may
draw, how likely a component is to appear, and which colors it may use. The
preview on the right follows every change. Click a preview to draw a new seed
for that one avatar.

Fill runs when you click the button in the footer. One undo reverts the whole
batch.

![The footer of the Generate tab with the Fill button](/integrations/figma/4.webp)

![The chat mockup with every placeholder filled](/integrations/figma/5.webp)

Every filled layer remembers its style, seed and options. Select one later and
the Design panel offers two plugin actions: **Regenerate avatars** draws new
seeds with the same settings, **Change avatar style** opens the plugin on the
style gallery.

## Insert new avatars

With nothing selected, the Generate tab switches to Insert new. Set how many
avatars you want, their size, the number of columns and the gap, and the plugin
inserts them as a grid of vector frames below the selection, or in the middle of
the viewport when nothing is selected.

![The Generate tab set to Insert new, with six random avatars in the preview](/integrations/figma/6.webp)

Inserted avatars are vectors, so you can edit them, turn them into components,
or export them in any format Figma offers.

## Use your own styles

The gallery has a second tab, Library. Upload a
[definition file](/create-styles/definition-schema/) there, and the style is
available in every Figma file you open, next to the collection.

![The Library tab of the style gallery with the Upload definition button](/integrations/figma/7.webp)

The definition can be one you exported with the Style tab, see
[Create an avatar style with Figma](/create-styles/with-figma/), or one you got
from someone else. The plugin shows the license the file names, but it cannot
check it, so make sure you may use the style before it goes into a design.

## Hand avatars to developers

Designs are mockups, the app needs the real thing. Select one or more generated
avatars, or a frame that holds some, and open the Inspect tab.

![Two filled avatars selected in the chat mockup](/integrations/figma/8.webp)

For each avatar the tab lists the style and its version, the seed, and the
options that differ from the style's defaults. Below that is the URL of the
[HTTP API](/integrations/http-api/) for the same avatar, as SVG, PNG, JPG or
WebP, and the JavaScript that renders it with the
[JS library](/integrations/javascript/). Every value has a copy button, and the
Open link shows the avatar in the browser.

![The Inspect tab with the seed, the API URL and the JavaScript for a selected avatar](/integrations/figma/9.webp)

Because DiceBear renders the same avatar from the same seed everywhere, the
avatar in the app matches the one in the design, whichever integration the
developer picks.

## Offline and privacy

The style collection and its previews come from `api.dicebear.com`. Definitions
you have used are cached in Figma's plugin storage and render offline, and the
avatars themselves are rendered inside the plugin, so no seed leaves Figma.
