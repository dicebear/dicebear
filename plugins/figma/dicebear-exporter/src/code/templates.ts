export const templates = {
  // .editorconfig
  '.editorconfig': `
[*]
indent_size = 2
tab_width = 2
`,

  // .gitignore
  '.gitignore': `
# Cache and log files
.DS_Store
yarn-error.log

# Dependencies
node_modules

# Build files
dist

# Generated files
src/options.ts
`,

  // .prettierignore
  '.prettierignore': `
package.json
`,

  // .prettierrc
  '.prettierrc': `
{
  "singleQuote": true,
  "proseWrap": "always"
}
`,

  // LICENSE
  LICENSE: `
MIT License

Copyright (c) {{year}} Florian Körner
{{#if isMitLicensed}}
{{#if creator}}
Copyright (c) {{year}} {{{creator}}}
{{/if}}
{{/if}}
{{#if contributor}}
Copyright (c) {{year}} {{{contributor}}}
{{/if}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,

  // README.md
  'README.md': `
<h1 align="center"><img src="./tests/svg/0.svg" width="124" /> <br />{{title}}</h1>
<p align="center">
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear</a></strong><br />
  {{#if source}}
    <a href="{{source}}">{{sourceTitle}}</a>
  {{else}}
    {{sourceTitle}}
  {{/if}}
  {{#if creator}}
    by {{creator}}
  {{/if}}
</p>

{{#unless isMitLicensed}}
<p align="center">
  While our code is MIT licensed, the design is licensed under
  {{#if licenseUrl}}
    <a href="{{licenseUrl}}">{{licenseName}}</a>.
  {{else}}
    {{licenseName}}.
  {{/if}}
  See <a href="https://dicebear.com/licenses">license overview</a> for more information.
</p>
{{/unless}}

{{#if isDicebearNamespace}}
<p align="center">
  <a href="https://dicebear.com/styles/{{packageNameLastPart}}">
    Read Documentation
  </a>
</p>
{{else}}
----

## Usage

### ESM

Install the DiceBear package and this avatar style with the following command:

\`\`\`
npm install @dicebear/core {{packageName}} --save
\`\`\`

Now you can create your first avatar.

\`\`\`js
import { createAvatar } from '@dicebear/core';
import * as style from '{{packageName}}';

let svg = createAvatar(style, {
  // ... options
});
\`\`\`

### CJS

Install the DiceBear package and this avatar style with the following command:

\`\`\`
npm install @dicebear/core {{packageName}} --save
\`\`\`

Now you can create your first avatar.

\`\`\`js
const { createAvatar } = require('@dicebear/core');
const style = require('{{packageName}}');

let svg = createAvatar(style, {
  // ... options
});
\`\`\`

## Options

All options from [DiceBear](https://dicebear.com/docs/options) and additionally the following:

{{#each properties}}
### {{@key}}

type: \`{{this.type}}\`  
{{#isDefined this.minimum}}
minimum: \`{{this.minimum}}\`  
{{/isDefined}}
{{#isDefined this.maximum}}
maximum: \`{{this.maximum}}\`  
{{/isDefined}}
{{#if this.items.enum}}
allowed: {{#each this.items.enum}}{{#if @key}}, {{/if}}\`{{this}}\`{{/each}}  
{{/if}}
{{#if this.items.[0].enum}}
allowed: {{#each this.items.enum}}{{#if @key}}, {{/if}}\`{{this}}\`{{/each}} or an \`hex color\`  
{{/if}}
{{#if this.default.[0]}}
default: \`[{{#each this.default}}{{#if @key}}, {{/if}}'{{this}}'{{/each}}]\`
{{else}}
default: \`{{this.default}}\`
{{/if}}


{{/each}}

## Build this package

\`\`\`
npm run build
\`\`\`

## Test this package

\`\`\`
npm run test
\`\`\`
{{/if}}
`,

  // jest.config.js
  'jest.config.js': `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
`,

  // package.json
  'package.json': `
{
  "name": "{{{packageName}}}",
  "version": "{{{packageVersion}}}",
  "description": "Avatar style for DiceBear",
  "keywords": ["dicebear"],
  "bugs": {
    "url": "https://github.com/dicebear/dicebear/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dicebear/dicebear.git"
  },
  "license": "MIT",
  "browserslist": ">.25%, not IE > 0, not dead",
  "source": "src/index.ts",
  "main": "dist/index.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "files": [
    "LICENSE",
    "README.md",
    "dist"
  ],
  "scripts": {
    "test": "jest",
    "prepublishOnly": "npm run build",
    "prebuild": "shx rm -rf dist",
    "build": "npm-run-all build:*",
    "build:schema": "json2ts src/schema.json src/options.ts",
    "build:parcel": "parcel build"
  },
  "dependencies": {},
  "devDependencies": {
    "@parcel/packager-ts": "^2.0.1",
    "@parcel/transformer-typescript-types": "^2.0.1",
    "@dicebear/core": "^5.0.0-alpha.6",
    "@tsconfig/recommended": "^1.0.0",
    "@types/jest": "^26.0.22",
    "@types/node": "^10.11.6",
    "json-schema-to-typescript": "^10.1.5",
    "npm-run-all": "^4.1.5",
    "parcel": "^2.0.1",
    "jest": "^26.6.3",
    "shx": "^0.3.3",
    "ts-jest": "^26.5.4",
    "typescript": "^4.5.2"
  },
  "peerDependencies": {
    "@dicebear/core": "^5.0.0-alpha.6"
  },
  "publishConfig": {
    "access": "public"
  }
}
`,

  // tsconfig.json
  'tsconfig.json': `
{
  "extends": "@tsconfig/recommended/tsconfig.json",
  "compilerOptions": {
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist",
  },
  "include": ["./src/**/*.ts"]
}
`,

  // tests/create.test.ts
  'tests/create.test.ts': `
import { createAvatar } from '@dicebear/core';
import * as style from '../dist';
import * as fs from 'fs';
import * as path from 'path';

const data = [
  [style, { seed: 'John Doe' }],
  [style, { seed: 'Jane Doe' }],
  [style, { seed: 'Florian' }],
  [style, { seed: 'Aneka' }],
  [style, { seed: 'Felix' }],
] as Array<Parameters<typeof createAvatar>>;

data.forEach((params, key) => {
  test(\`Create avatar #$\{key}\`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg/create', \`$\{key}.svg\`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent), { recursive: true });
      }

      fs.writeFileSync(svgComponent, createAvatar(...params), { encoding: 'utf-8' });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    expect(createAvatar(...params)).toEqual(svg);
  });
});  
`,

  // tests/preview.test.ts
  'tests/preview.test.ts': `
import { createPreview } from '@dicebear/core';
import * as style from '../dist';
import * as fs from 'fs';
import * as path from 'path';

const data = [
  {{#each components}}
    [style, { seed: 'test' }, '{{@key}}'],
  {{/each}}
  {{#each colors}}
    {{#if this.isUsedByComponents}}
      [style, { seed: 'test' }, '{{@key}}Color'],
    {{/if}}
  {{/each}}
  [style, { seed: 'test', backgroundColor: ['#ff0000'] }, 'backgroundColor'],
] as Array<Parameters<typeof createPreview>>;

data.forEach((params, key) => {
  test(\`Create avatar #$\{key}\`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg/preview', \`$\{key}.svg\`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent), { recursive: true });
      }

      fs.writeFileSync(svgComponent, createPreview(...params), { encoding: 'utf-8' });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    expect(createPreview(...params)).toEqual(svg);
  });
});  
`,

  // src/index.ts
  'src/index.ts': `
/*!
 * {{{title}}} ({{packageName}})
 *
 * Code licensed under MIT License.
 * Copyright (c) {{year}} Florian Körner
{{#if isMitLicensed}}
{{#if creator}}
* Copyright (c) {{year}} {{{creator}}}
{{/if}}
{{/if}}
{{#if contributor}}
 * Copyright (c) {{year}} {{{contributor}}}
{{/if}}
 *
 * Design "{{{sourceTitle}}}"{{#if creator}} by {{{creator}}}{{/if}}{{#if licenseName}} licensed under {{{licenseName}}}{{/if}}.
{{#if source}}
 * Source: {{{source}}}
{{/if}}
{{#if licenseUrl}}
 * License: {{{licenseUrl}}}
{{/if}}
 */

import { style } from './core';

const { create, preview, meta, schema } = style;

export { create, preview, meta, schema };
export type { Options } from './options';
`,

  // src/core.ts
  'src/core.ts': `
import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './options';

import schema from './schema.json';
import { getComponents } from './utils/getComponents';
import { getColors } from './utils/getColors';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';
import { dimensions } from './meta/components';

export const style: Style<Options> = {
  meta: {
    title: '{{{sourceTitle}}}',
    {{#if creator}}
      creator: '{{{creator}}}',
    {{/if}}
    {{#if contributor}}
      contributor: '{{{contributor}}}',
    {{/if}}
    {{#if source}}
      source: '{{{source}}}',
    {{/if}}
    {{#if licenseName}}
      license: {
        name: '{{{licenseName}}}',
        {{#if licenseUrl}}
        url: '{{{licenseUrl}}}',
        {{/if}}
      },
    {{/if}}
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options, preview: false });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: false });
    
    {{#if backgroundColorGroupName}}
      options.backgroundColor = [colors.background.value];
    {{/if}}

    return {
      attributes: {
        viewBox: '0 0 {{size}} {{size}}',
        fill: 'none',
        'shape-rendering': '{{shapeRendering}}'
      },
      body: {{{body}}},
    };
  },
  preview: ({ prng, options, property }) => {
    const componentGroup = property.toString();
    const colorGroup = property.toString().replace(/Color$/, '');

    onPreCreate({ prng, options, preview: true });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: true });

    {{#if backgroundColorGroupName}}
      options.backgroundColor = [colors.background.value];
    {{/if}}

    if (componentGroup in components) {
      const { width, height } = dimensions[componentGroup]!;

      return {
        attributes: {
          viewBox: \`0 0 $\{width} $\{height}\`,
          fill: 'none',
          'shape-rendering': '{{shapeRendering}}',
        },
        body: components[componentGroup]?.value(components, colors) ?? '',
      };
    }

    if (colorGroup in colors) {
      return {
        attributes: {
          viewBox: \`0 0 1 1\`,
          fill: 'none',
          'shape-rendering': '{{shapeRendering}}',
        },
        body: \`<rect width="1" height="1" fill="$\{colors[colorGroup].value}" />\`,
      };
    }

    return undefined;
  },
};
`,

  // src/static-types.ts
  'src/static-types.ts': `
export type ColorGroup = Record<string, ColorGroupItem>;
export type ColorGroupCollection = Record<string, ColorGroup>;
export type ColorGroupItem = string;
export type ColorPickCollection = Record<string, ColorPick>;
export type ColorPick = {
  name: string;
  value: ColorGroupItem;
};

export type ComponentGroup = Record<string, ComponentGroupItem>;
export type ComponentGroupCollection = Record<string, ComponentGroup>;
export type ComponentGroupItem = (
  components: ComponentPickCollection,
  colors: ColorPickCollection
) => string;
export type ComponentPickCollection = Record<string, ComponentPick>;
export type ComponentPick =
  | {
      name: string;
      value: ComponentGroupItem;
    }
  | undefined;  
`,

  // src/colors/index.ts
  'src/colors/index.ts': `
{{#each colors}}
  {{#if this.isUsedByComponents}}
    export { {{@key}} } from './{{@key}}';
  {{else}}
    {{#isEqual @key ../backgroundColorGroupName}}
      export { {{@key}} } from './{{@key}}';
    {{/isEqual}}
  {{/if}}
{{/each}}
`,

  // src/colors/{{name}}.ts
  'src/colors/{{name}}.ts': `
import type { ColorGroup } from "../static-types";

export const {{name}}: ColorGroup = {
  {{#each colors}}
    '{{@key}}': 'rgba({{this.value.r}}, {{this.value.g}}, {{this.value.b}}, {{this.value.a}})',
  {{/each}}
}
`,

  // src/meta/components.ts
  'src/meta/components.ts': `
export const dimensions: Record<string, { width: number; height: number }> = {
  {{#each components}}
    '{{@key}}': {
      width: {{this.width}},
      height: {{this.height}}
    },
  {{/each}}
}
`,

  // src/components/index.ts
  'src/components/index.ts': `
{{#each components}}
  export { {{@key}} } from './{{@key}}';
{{/each}}
`,

  // src/components/{{name}}.ts
  'src/components/{{name}}.ts': `
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const {{name}}: ComponentGroup = {
  {{#each components}}
    '{{@key}}': (components: ComponentPickCollection, colors: ColorPickCollection) => {{{this}}},
  {{/each}}
}
`,

  // src/utils/getColors.ts
  'src/utils/getColors.ts': `
import type { Prng } from '@dicebear/core';
import type { Options } from '../options';
import type { ColorPickCollection } from '../static-types';
import { pickColor } from './pickColor';

type Props = {
  prng: Prng,
  options: Options
}

export function getColors({ prng, options }: Props): ColorPickCollection {
  return {
    {{#each colors}}
      {{#if this.isUsedByComponents}}
        '{{@key}}': pickColor({
          prng,
          group: '{{@key}}',
          values: options.{{@key}}Color
        }),
      {{/if}}
    {{/each}}
    {{#if backgroundColorGroupName}}
      background: pickColor({
        prng,
        group: '{{backgroundColorGroupName}}',
        values: options.backgroundColor
      }),
    {{/if}}
  }
};
`,

  // src/utils/getComponents.ts
  'src/utils/getComponents.ts': `
import type { Prng } from '@dicebear/core';
import type { Options } from '../options';
import type { ComponentPickCollection } from '../static-types';
import { pickComponent } from './pickComponent';

type Props = {
  prng: Prng,
  options: Options
}

export function getComponents({ prng, options }: Props): ComponentPickCollection {
  {{#each components}}
    const {{@key}}Component = pickComponent({
      prng,
      group: '{{@key}}',
      values: options.{{@key}}
    });
  {{/each}}

  return {
    {{#each components}}
      {{#isNull this.settings.probability.length}}
        '{{@key}}': {{@key}}Component,
      {{else}}
        '{{@key}}': prng.bool(options.{{@key}}Probability) ? {{@key}}Component : undefined,
      {{/isNull}}
    {{/each}}
  }
};
`,

  // src/utils/pickColor.ts
  'src/utils/pickColor.ts': `
import type { Prng } from '@dicebear/core';
import type { ColorGroupCollection, ColorPick } from '../static-types';
import * as colors from '../colors';

type Props = {
  prng: Prng,
  group: string,
  values?: string[]
}

export function pickColor({prng, group, values = []}: Props): ColorPick {
  const colorCollection: ColorGroupCollection = colors;

  if (values.length === 0) {
    values.push('transparent');
  }

  const key = prng.pick(values);

  return {
    name: key,
    value: colorCollection[group][key] ?? key,
  };
}
`,

  // src/utils/pickComponent.ts
  'src/utils/pickComponent.ts': `
import type { Prng } from '@dicebear/core';
import type { ComponentGroupCollection, ComponentPick } from '../static-types';
import * as components from '../components';

type Props = {
  prng: Prng,
  group: string,
  values?: string[]
}

export function pickComponent({ prng, group, values = []}: Props): ComponentPick {
  const componentCollection: ComponentGroupCollection = components;

  const key = prng.pick(values);

  if (componentCollection[group][key]) {
    return {
      name: key,
      value: componentCollection[group][key],
    };
  } else {
    return undefined;
  }
}  
`,

  // src/hooks/onPreCreate.ts
  'src/hooks/onPreCreate.ts': `
import { Prng, StyleOptions } from "@dicebear/core";

import { Options } from "../options";

type Props = { prng: Prng, options: StyleOptions<Options>, preview: boolean } 

export function onPreCreate({ prng, options, preview }: Props) {
  {{#if content}}
    {{{content}}}
  {{else}}
    // Write your modifications here
  {{/if}}
}
`,

  // src/hooks/onPostCreate.ts
  'src/hooks/onPostCreate.ts': `
import { Prng, StyleOptions } from "@dicebear/core";

import { Options } from "../options";
import { ColorPickCollection, ComponentPickCollection } from "../static-types";

type Props = {
  prng: Prng,
  options: StyleOptions<Options>,
  components: ComponentPickCollection,
  colors: ColorPickCollection,
  preview: boolean
} 

export function onPostCreate({ prng, options, components, colors, preview }: Props) {
  {{#if content}}
    {{{content}}}
  {{else}}
    // Write your modifications here
  {{/if}}
}
`,
};
