export const templates = {
  // .editorconfig
  ".editorconfig": `
[*]
indent_size = 2
tab_width = 2
`,

  // .gitignore
  ".gitignore": `
# Cache and log files
.DS_Store
yarn-error.log

# Dependencies
node_modules

# Build files
dist

# Generated files
src/options.ts
src/schema.ts
`,

  // .prettierignore
  ".prettierignore": `
package.json
`,

  // .prettierrc
  ".prettierrc": `
{
  "printWidth": 120,
  "singleQuote": true,
  "proseWrap": "always"
}
`,

  // license.md
  "license.md": `
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

  // readme.md
  "README.md": `
<h1 align="center"><img src="./tests/svg/0.svg" width="124" /> <br />{{title}}</h1>
<p align="center">
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear Avatars</a>.</strong><br />
  {{#if source}}
    <a href="{{source}}">{{title}}</a>
  {{else}}
    {{title}}
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
npm install @dicebear/avatars {{packageName}} --save
\`\`\`

Now you are ready to create your first Avatar.

\`\`\`js
import { createAvatar } from '@dicebear/avatars';
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
  "jest.config.js": `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
`,

  // package.json
  "package.json": `
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
    "build": "dicebear-project build {{umdName}}"
  },
  "dependencies": {},
  "devDependencies": {
    "@dicebear/avatars": "^4.7.4",
    "@tsconfig/node12": "^1.0.7",
    "@types/jest": "^26.0.22",
    "@types/node": "^10.11.6",
    "dicebear-project": "^4.7.4",
    "jest": "^26.6.3",
    "ts-jest": "^26.5.4",
    "typescript": "^4.2.3",
    "utility-types": "^3.10.0"
  },
  "peerDependencies": {
    "@dicebear/avatars": "^4.6.0"
  }
}
`,

  // tsconfig.json
  "tsconfig.json": `
{
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "./dist",
  },
  "include": ["./src/index.ts"]
}
`,

  // tests/create.test.ts
  "tests/create.test.ts": `
import * as avatars from '@dicebear/avatars';
import { StyleOptions } from '@dicebear/avatars';
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

      fs.writeFileSync(svgComponent, avatars.createAvatar(style, options), { encoding: 'utf-8' });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    expect(avatars.createAvatar(style, options)).toEqual(svg);
    expect(new avatars.default(style.default, options).create(options.seed)).toEqual(svg);
  });
});
`,

  // src/index.ts
  "src/index.ts": `
/*!
 * {{{title}}} ({{packageName}})
 *
 * Code licensed under MIT License.
 * Copyright (c) {{year}} Florian Körner
{{#if contributor}}
 * Copyright (c) {{year}} {{{contributor}}}
{{/if}}
 *
 * Design "{{{title}}}"{{#if creator}} by {{{creator}}}{{/if}}{{#if licenseName}} licensed under {{{licenseName}}}{{/if}}.
{{#if source}}
 * Source: {{{source}}}
{{/if}}
{{#if licenseUrl}}
 * License: {{{licenseUrl}}}
{{/if}}
 */

import { utils } from '@dicebear/avatars';
import { style } from './core';

let { create, meta, schema } = style;

export { create, meta, schema };
export { Options } from './options';

/** @deprecated will be removed in Version 5.0 */
export default utils.style.createLegacyWrapper(style);
`,

  // src/core.ts
  "src/core.ts": `
import type { Style } from '@dicebear/avatars';
import type { Options } from './options';
import type { ComponentPickCollection, ColorPickCollection } from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';

export const style: Style<Options> = {
  meta: {
    title: '{{{title}}}',
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
  schema,
  create: ({ prng, options }) => {
    {{#each components}}
    const {{@key}}Component = pickComponent(prng, '{{@key}}', options.{{@key}});
    {{/each}}

    const components: ComponentPickCollection = {
      {{#each components}}
      {{#isNull this.settings.propability.length}}
      '{{@key}}': {{@key}}Component,
      {{else}}
      '{{@key}}': prng.bool(options.{{@key}}Propability) ? {{@key}}Component : undefined,
      {{/isNull}}
      {{/each}}
    }

    const colors: ColorPickCollection = {
      {{#each colors}}
      '{{@key}}': pickColor(prng, '{{@key}}', options.{{@key}}Color ?? []),
      {{/each}}
    }

    return {
      attributes: {
        viewBox: '0 0 {{size}} {{size}}',
        fill: 'none',
      },
      body: {{{body}}},
    };
  },
};
`,

  // src/static-types.ts
  "src/static-types.ts": `
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
export type ComponentGroupItem = (components: ComponentPickCollection, colors: ColorPickCollection) => string;
export type ComponentPickCollection = Record<string, ComponentPick>;
export type ComponentPick =
  | {
      name: string;
      value: ComponentGroupItem;
    }
  | undefined;  
`,

  // src/colors/index.ts
  "src/colors/index.ts": `
{{#each colors}}
export { {{@key}} } from './{{@key}}';
{{/each}}
`,

  // src/colors/{{name}}.ts
  "src/colors/{{name}}.ts": `
import type { ColorGroup } from "../static-types";

export const {{name}}: ColorGroup = {
{{#each colors}}
  '{{@key}}': 'rgba({{this.value.r}}, {{this.value.g}}, {{this.value.b}}, {{this.value.a}})',
{{/each}}
}
`,

  // src/components/index.ts
  "src/components/index.ts": `
{{#each components}}
export { {{@key}} } from './{{@key}}';
{{/each}}
`,

  // src/components/{{name}}.ts
  "src/components/{{name}}.ts": `
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const {{name}}: ComponentGroup = {
{{#each components}}
  '{{@key}}': (components: ComponentPickCollection, colors: ColorPickCollection) => {{{this}}},
{{/each}}
}
`,

  // src/utils/pickColor.ts
  "src/utils/pickColor.ts": `
import type { Prng } from '@dicebear/avatars';
import type { ColorGroupCollection, ColorPick } from '../static-types';

import * as colors from '../colors';

export function pickColor(prng: Prng, group: string, values: string[]): ColorPick {
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
  "src/utils/pickComponent.ts": `
import type { Prng } from '@dicebear/avatars';
import type { ComponentGroupCollection, ComponentPick } from '../static-types';

import * as components from '../components';

export function pickComponent(prng: Prng, group: string, values: string[] = []): ComponentPick {
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
};
