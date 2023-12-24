# Create an avatar style with Figma

Our [Figma plugin](https://www.figma.com/community/plugin/1005765655729342787)
is the easiest way to create an avatar style for DiceBear. The following
tutorial requires basic knowledge about [Figma](https://www.figma.com/) and
[Node.js](https://nodejs.org/en/).

## Step 1

If you want DiceBear to dynamically change colors in your avatar, you have to
create the colors in Figma as
[locale style](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles).
Arrange the colors in
[groups](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles#Manage_styles).
Name them according to the following pattern: `<group>/<option-name>`. For
example, `skin/light`.

You will use the locale styles later to colorize paths. DiceBear will then
change the colors of the paths within a group depending on the seed and color
settings. For the names of `<group>` and `<option-name>` you can use
alphanumeric characters as well as hyphens.

In the following example you can see how this could look like:

<video src="/guides/create-an-avatar-style-with-figma/1.mp4" controls muted></video>

## Step 2

Now assign a color from the created groups to your paths that will be colored
dynamically. Which color from a group does not matter. The important thing is
that the group is correct.

<video src="/guides/create-an-avatar-style-with-figma/2.mp4" controls muted></video>

## Step 3

Create the individual parts of your avatar as
[components](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma).
Again, use the `<group>/<option-name>` naming pattern to create groups.

Identical to the colors, DiceBear will later (taking into account the seed and
the settings) select a component from a group and put it into the avatar.

<video src="/guides/create-an-avatar-style-with-figma/3.mp4" controls muted></video>

## Step 4

Make sure that each component in a group has the same dimensions.

<video src="/guides/create-an-avatar-style-with-figma/4.mp4" controls muted></video>

## Step 5

Create as many color and component groups as you like. Then you can bring all
the components together.

To do this,
[create a frame](https://help.figma.com/hc/en-us/articles/360041539473-Frames-in-Figma)
and make sure that the width and height are identical. From the Assets tab, drag
one instance from each component group into the frame.

<video src="/guides/create-an-avatar-style-with-figma/5.mp4" controls muted></video>

## Step 6

Search now for the
[DiceBear Exporter](https://www.figma.com/community/plugin/1005765655729342787)
plugin. Make sure you have selected the frame and start the plugin.

A dialog will open where you can make all kinds of settings. For example the
name of your avatar style, the license or the probability with which the
components will appear in your avatar later.

The settings are automatically saved to your frame. Once you are happy with your
settings, you can export your avatar style.

<video src="/guides/create-an-avatar-style-with-figma/6.mp4" controls muted></video>

## Step 7

Now you can unzip the created zip archive. Then open the console. Make sure that
you have [Node.js](https://nodejs.org/en/) installed on your system.

With the following command you can install all dependencies:

```
npm install
```

After that you can compile your avatar style:

```
npm run build
```

And with the following command you can create sample avatars of your avatar
style:

```
npm run test
```

<video src="/guides/create-an-avatar-style-with-figma/7.mp4" controls muted></video>

## Step 8

Congratulations! You can now use your avatar style with the
[JS-Library](/how-to-use/js-library/).

```js
import { createAvatar } from '@dicebear/core';
import * as style from 'path/to/your-avatar-style';

let avatar = createAvatar(style, {
  seed: 'dicebear',
  // ... other options
});
```

::: warning Limitations

Currently it is not yet possible to use custom avatar styles with the CLI or
HTTP API without a fork of these projects.

:::
