---
title: Edit an Avatar Style with Figma
description: >
  Import a DiceBear definition file into Figma with the DiceBear Studio plugin,
  change the style, and export it again.
---

# Edit an avatar style with Figma

Our
[DiceBear Studio](https://www.figma.com/community/plugin/1005765655729342787)
plugin works in both directions. It turns a Figma frame into an avatar style,
and it turns a style definition back into a Figma file. So you can open one of
our styles in Figma, change it, and export your own version of it.

You need two things: the plugin, and the
[definition file](/create-styles/definition-schema/) of the style you want to
change. Every style page has a Definition button above the preview. The
screenshots below use [Critters](/styles/critters/).

::: tip Looking for something else?

This guide changes one of our styles. The plugin has two more guides:

- You want to draw a style of your own from scratch:
  [Create an avatar style with Figma](/create-styles/with-figma/)
- You only want avatars in your designs, no style of your own:
  [Figma plugin](/integrations/figma/)

:::

::: warning

Every style has its own license, and the definition names the artist. The import
copies both into your Figma file, and the export writes them back. So read the
license before you publish your version. The [licenses](/licenses/) page lists
them.

:::

## Step 1

Create an empty Figma design file, then start the plugin. The quickest way is
the Actions search in the toolbar.

The file has to be empty. If it already holds color styles or components with
group names, the plugin refuses to import into it.

![Searching for the DiceBear Studio plugin in Figma](/create-styles/edit-a-style/1.webp)

## Step 2

Switch to the Style tab in the rail on the left, click Import definition and
pick your definition file.

The plugin reads the file before it touches your document. If the definition is
broken, you get a list of the problems and nothing is imported.

![The Style tab of the plugin with the Import definition button at the top of the sidebar](/create-styles/edit-a-style/2.webp)

## Step 3

The import takes a moment. The plugin builds a Figma component for every variant
of every component group, and a big style has a few hundred of them.

![The plugin while it imports](/create-styles/edit-a-style/3.webp)

## Step 4

When it is done, the plugin shows the settings of your style: the title, the
license, and the settings of every component group and color group. Below that
it lists what it could not import. Read that list. Whatever is on it is missing
in Figma, and it will be missing in your export as well.

![The style settings with the import warnings below them](/create-styles/edit-a-style/4.webp)

::: tip

Declarative animations arrive as real Figma animations: the plugin writes them
as keyframes on the imported layers, and an export carries edited keyframes back
into the definition. This needs animation support in your Figma plan. Styles
that still keep their animation as raw CSS in a `<style>` element arrive as a
still avatar instead, since Figma has no place for CSS.

:::

## Step 5

The plugin leaves you on the Avatar page. The frame in the middle is your style.
It holds one instance per component group and stores all the settings. Next to
it is a short guide for whoever opens the file after you.

![The imported avatar frame next to the guide](/create-styles/edit-a-style/5.webp)

## Step 6

The rest of the style sits on the other pages. Thumbnail holds the cover that
Figma shows for the file, Components holds the parts of the avatar, and License
holds the credits of the definition in one card. The palettes came along as
color styles.

On the Components page every group is a row, and every variant in it is a
component named `<group>/<variant>`. When DiceBear draws an avatar, it picks one
component per row.

![The Components page with one row per component group, and the color styles in the Design panel](/create-styles/edit-a-style/6.webp)

## Step 7

Now change the style. Double-click a part of the frame to select it, then pick
another variant from the dropdown at the top of the Design panel, or bind a
shape to a different color style. You can also redraw a component, or draw a new
one and name it after the same pattern.

![A selected part of the avatar and its variant dropdown](/create-styles/edit-a-style/7.webp)

::: tip

The layer bound to the `background` palette only exists so the frame looks right
in Figma. DiceBear paints the background itself, so the export leaves that layer
out.

:::

## Step 8

Select the frame, start the plugin again, and click Export definition. You get a
definition file that works right away, without a build step.

Try it with the [CLI](/integrations/cli/):

```
dicebear create ./critters.json -o ./test-output --count 10
```

[Step 8 of the Figma guide](/create-styles/with-figma/#step-8) shows how to use
your definition with each of our libraries. To use it in Figma itself, upload it
to the library of the plugin's Generate tab, see
[Use your own styles](/integrations/figma/#use-your-own-styles).
