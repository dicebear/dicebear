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
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear Avatars</a>.</strong><br />
  {{#if source}}
    <a href="{{source}}">{{sourceTitle}}</a>
  {{else}}
    {{sourceTitle}}
  {{/if}}
  {{#if creator}}
    by {{creator}}
  {{/if}}
  {{#if licenseName}}
    licensed under
    {{#if licenseUrl}}
      <a href="{{licenseUrl}}">{{licenseName}}</a>.
    {{else}}
      {{licenseName}}
    {{/if}}
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

----

## Usage

Install the DiceBear package and this Avatar styles with the following command.

\`\`\`
npm install @dicebear/core {{packageName}} --save
\`\`\`

Now you are ready to create your first Avatar.

\`\`\`js
import { createAvatar } from '@dicebear/core';
import * as style from '{{packageName}}';

let svg = createAvatar(style, {
  seed: 'custom-seed',
  // ... and other options
});
\`\`\`

## Options

All [options from DiceBear](https://avatars.dicebear.com/docs/options) and additionally the following:

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
  "source": "src/index.ts",
  "main": "dist/index.js",
  "module": "dist/index.es.js",
  "browser": "dist/index.umd.js",
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
    "build": "dicebear-project build {{umdName}}"
  },
  "dependencies": {},
  "devDependencies": {
    "@dicebear/core": "^4.7.4",
    "@tsconfig/recommended": "^1.0.0",
    "@types/jest": "^26.0.22",
    "@types/node": "^10.11.6",
    "dicebear-project": "^4.7.4",
    "jest": "^26.6.3",
    "shx": "^0.3.3",
    "ts-jest": "^26.5.4",
    "typescript": "^4.2.3",
    "utility-types": "^3.10.0"
  },
  "peerDependencies": {
    "@dicebear/core": "^4.6.0"
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
import { createAvatar, StyleOptions } from '@dicebear/core';
import * as style from '../dist';
import * as fs from 'fs';
import * as path from 'path';

const data: Array<StyleOptions<style.Options>> = [
  { seed: 'John Doe' },
  { seed: 'Jane Doe' },
  { seed: 'Florian' },
  { seed: 'Aneka' },
  { seed: 'Felix' },
];

data.forEach((options, key) => {
  test(\`Create avatar #$\{key}\`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg', \`$\{key}.svg\`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent));
      }

      fs.writeFileSync(svgComponent, createAvatar(style, options), { encoding: 'utf-8' });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    expect(createAvatar(style, options)).toEqual(svg);
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

let { create, meta, schema } = style;

export { create, meta, schema };
export { Options } from './options';
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
    onPreCreate({ prng, options });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors });
    
    {{#if backgroundColorGroupName}}
      options.backgroundColor = colors.background.value;
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
    onPreCreate({ prng, options });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors });
    
    const componentKey = property.toString();
    if (componentKey in components) {
      const width = components[componentKey]?.value.width ?? 0;
      const height = components[componentKey]?.value.height ?? 0;

      return {
        attributes: {
          viewBox: \`0 0 $\{width} $\{height}\`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: components[componentKey]?.value.render(components, colors) ?? '',
      };
    }
    
    const colorKey = property.toString().replace(/Color$/, '');
    if (colorKey !== property && colorKey in colors) {
      return {
        attributes: {
          viewBox: '0 0 1 1',
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: \`<rect width="1" height="1" fill="$\{colors[colorKey].value}" />\`,
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
export type ComponentGroupItem = {
  width: number;
  height: number;
  render: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => string;
}
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
    '{{@key}}': {
      width: {{this.width}},
      height: {{this.height}},
      render: (components: ComponentPickCollection, colors: ColorPickCollection) => {{{this.template}}}
    },
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

type Props = { prng: Prng, options: StyleOptions<Options> } 

export function onPreCreate({ prng, options }: Props) {
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

type Props = { prng: Prng, options: StyleOptions<Options>, components: ComponentPickCollection, colors: ColorPickCollection } 

export function onPostCreate({ prng, options, components, colors }: Props) {
  {{#if content}}
    {{{content}}}
  {{else}}
    // Write your modifications here
  {{/if}}
}
`,
};
