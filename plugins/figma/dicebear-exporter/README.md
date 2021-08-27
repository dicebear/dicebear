# Figsvelte

A boilerplate for creating Figma plugins using Svelte.

This starter project has everything you need to start developing a Figma plugin usign Svelte. Your JS, CSS, SVG and
image assets can be bundled on build. The package will take care of compiling your typescript + app on save during
development, and also minify on build.

Additionally, this package comes preconfigured with
[Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte) where you have access to a large range
of components and icons that match the Figma UI, to get you up and running quickly. Note: installing this boilerplate
will install the component library as a dependency.

Only what you import/use will be included in the final build for small bundle size.

## To get started

```bash
npx degit thomas-lowry/figsvelte figma-plugin
cd figma-plugin
npm install
```

_Note that you will need to have [Node.js](https://nodejs.org/) installed._

## Connecting your plugin to Figma

Connecting your plugin to Figma After installing, go to **Plugins / Development / New Plugin** in the Figma desktop app
for Mac OS or Windows and choose the option **"Link existing plugin"**.

_You also can just type "New Plugin" in Figma global search to go there_

From there you need to link a **manifest.json** file located at **public** folder in your directory:

```bash
/figma-plugin/public/manifest.json
```

Now edit this file to give a new name for your plugin, and you will be able call it from Figma: **Plugins / Development
/ Your Plugin Name**

## Development

During development, watch your project for changes with the following command.

```bash
npm run dev
```

Start building your plugin UI in `'src/Plugin.svelte'`.

## Build

When ready to package up your final Figma Plugin:

```bash
npm run build
```

## Useful info

To include an external CSS file:

```javascript
import styles from './styles.css';
```

To include an SVG:

```javascript
import SvgName from './image.svg';

//use in your markup
{@html SvgName}
```

_For more info on using the Icon component system with SVGs from
[Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte), refer to the repo._

_For info about Figma API visit [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/)_
