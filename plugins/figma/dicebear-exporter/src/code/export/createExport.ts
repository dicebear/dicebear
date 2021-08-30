import { templates } from '../templates';
import { prepareExport } from './prepareExport';
// @ts-ignore
import * as handlebars from 'handlebars/dist/cjs/handlebars.js';
import { createTemplateString } from './createTemplateString';
import { JSONSchema7Definition } from 'json-schema';
import { normalizeCamelCase } from '../utils/normalizeCamelCase';
import { filterDefaults } from '../utils/filterDefaults';
import { normalizeName } from '../utils/normalizeName';

handlebars.registerHelper('isNull', function (val: unknown, options: unknown) {
  if (val === null) {
    // @ts-ignore
    return options.fn(this);
  }

  // @ts-ignore
  return options.inverse(this);
});

handlebars.registerHelper('isEqual', function (val: unknown, val2: unknown, options: unknown) {
  if (val === val2) {
    // @ts-ignore
    return options.fn(this);
  }

  // @ts-ignore
  return options.inverse(this);
});

export async function createExport() {
  const exportData = prepareExport();

  const files: Record<string, string> = {
    '.editorconfig': templates['.editorconfig'],
    '.gitignore': templates['.gitignore'],
    '.prettierignore': templates['.prettierignore'],
    '.prettierrc': templates['.prettierrc'],
    'LICENSE.md': handlebars.compile(templates['LICENSE.md'])({
      year: new Date().getFullYear(),
      contributor: exportData.frame.settings.contributor,
    }),
    'jest.config.js': templates['jest.config.js'],
    'package.json': handlebars.compile(templates['package.json'])({
      umdName: exportData.frame.settings.umdName,
      packageName: exportData.frame.settings.packageName,
      packageVersion: exportData.frame.settings.packageVersion,
    }),
    'tsconfig.json': templates['tsconfig.json'],
    'tests/create.test.ts': templates['tests/create.test.ts'],
    'src/index.ts': handlebars.compile(templates['src/index.ts'])({
      title: exportData.frame.settings.title,
      year: new Date().getFullYear(),
      packageName: exportData.frame.settings.packageName,
      creator: exportData.frame.settings.creator,
      licenseName: exportData.frame.settings.licenseName,
      licenseUrl: exportData.frame.settings.licenseUrl,
      contributor: exportData.frame.settings.contributor,
      source: exportData.frame.settings.source,
    }),
    'src/core.ts': handlebars.compile(templates['src/core.ts'])({
      title: exportData.frame.settings.title,
      creator: exportData.frame.settings.creator,
      licenseName: exportData.frame.settings.licenseName,
      licenseUrl: exportData.frame.settings.licenseUrl,
      contributor: exportData.frame.settings.contributor,
      source: exportData.frame.settings.source,
      backgroundColorGroupName: exportData.frame.settings.backgroundColorGroupName,
      components: exportData.components,
      colors: exportData.colors,
      size: (figma.getNodeById(exportData.frame.id) as FrameNode).width,
      body: await createTemplateString(figma.getNodeById(exportData.frame.id) as FrameNode),
    }),
    'src/static-types.ts': templates['src/static-types.ts'],
    'src/colors/index.ts': handlebars.compile(templates['src/colors/index.ts'])({
      colors: exportData.colors,
      backgroundColorGroupName: exportData.frame.settings.backgroundColorGroupName,
    }),
    'src/components/index.ts': handlebars.compile(templates['src/components/index.ts'])({
      components: exportData.components,
    }),
    'src/utils/pickColor.ts': templates['src/utils/pickColor.ts'],
    'src/utils/pickComponent.ts': templates['src/utils/pickComponent.ts'],
    'src/hooks/onCreate.ts': handlebars.compile(templates['src/hooks/onCreate.ts'])({
      content: exportData.frame.settings.onCreateHook,
    }),
    'src/hooks/onSchemaLoad.ts': handlebars.compile(templates['src/hooks/onSchemaLoad.ts'])({
      content: exportData.frame.settings.onSchemaLoadHook,
    }),
  };

  const schemaProperties: Record<string, JSONSchema7Definition> = {};

  // Components
  const componentTemplate = handlebars.compile(templates['src/components/{{name}}.ts']);

  for (const componentGroupName in exportData.components) {
    if (false === exportData.components.hasOwnProperty(componentGroupName)) {
      continue;
    }

    const componentGroup = exportData.components[componentGroupName];
    const components: Record<string, string> = {};

    schemaProperties[componentGroupName] = {
      title: normalizeCamelCase(componentGroupName),
      type: 'array',
      items: {
        type: 'string',
        enum: Object.keys(componentGroup.collection),
      },
      default: filterDefaults(componentGroup.settings.defaults),
    };

    if (typeof componentGroup.settings.probability === 'number') {
      schemaProperties[`${componentGroupName}Probability`] = {
        title: `${normalizeCamelCase(componentGroupName)} Probability`,
        $ref: 'https://dicebear.com/schema/v4.json#/definitions/probability',
        default: componentGroup.settings.probability,
      };
    }

    for (const componentName in componentGroup.collection) {
      if (false === componentGroup.collection.hasOwnProperty(componentName)) {
        continue;
      }

      const componentNode = figma.getNodeById(componentGroup.collection[componentName].id) as ComponentNode;

      components[componentName] = await createTemplateString(componentNode);
    }

    files[`src/components/${componentGroupName}.ts`] = componentTemplate({
      name: componentGroupName,
      components,
    });
  }

  // Colors
  const colorTemplate = handlebars.compile(templates['src/colors/{{name}}.ts']);

  for (const colorGroupName in exportData.colors) {
    if (false === exportData.colors.hasOwnProperty(colorGroupName)) {
      continue;
    }

    const colorGroup = exportData.colors[colorGroupName];

    if (
      false === colorGroup.isUsedByComponents &&
      colorGroupName !== exportData.frame.settings.backgroundColorGroupName
    ) {
      continue;
    }

    if (colorGroup.isUsedByComponents) {
      schemaProperties[`${colorGroupName}Color`] = {
        title: `${normalizeCamelCase(colorGroupName)} Color`,
        type: 'array',
        items: {
          anyOf: [
            {
              type: 'string',
              enum: Object.keys(colorGroup.collection),
            },
            {
              $ref: 'https://dicebear.com/schema/v4.json#/definitions/color',
            },
          ],
        },
        default: filterDefaults(colorGroup.settings.defaults),
      };
    }

    if (exportData.frame.settings.backgroundColorGroupName === colorGroupName) {
      schemaProperties[`backgroundColor`] = {
        title: `Background Color`,
        anyOf: [
          {
            $ref: 'https://dicebear.com/schema/v4.json#/definitions/color',
          },
          {
            type: 'string',
            pattern: '^[0-9a-zA-Z]+$',
          },
          {
            type: 'array',
            items: {
              anyOf: [
                {
                  type: 'string',
                  pattern: '^[0-9a-zA-Z]+$',
                },
                {
                  $ref: 'https://dicebear.com/schema/v4.json#/definitions/color',
                },
              ],
            },
          },
        ],
        default: filterDefaults(colorGroup.settings.defaults),
      };
    }

    files[`src/colors/${colorGroupName}.ts`] = colorTemplate({
      name: colorGroupName,
      colors: colorGroup.collection,
    });
  }

  // Schema JSON
  files[`schema.json`] = JSON.stringify(
    {
      title: 'Options',
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: schemaProperties,
      additionalProperties: false,
    },
    undefined,
    2
  );

  // Readme
  files['README.md'] = handlebars.compile(templates['README.md'])({
    title: exportData.frame.settings.title,
    source: exportData.frame.settings.source,
    creator: exportData.frame.settings.creator,
    licenseName: exportData.frame.settings.licenseName,
    licenseUrl: exportData.frame.settings.licenseUrl,
    packageName: exportData.frame.settings.packageName,
    isMitLicensed: exportData.frame.settings.licenseName && exportData.frame.settings.licenseName === 'MIT',
    properties: schemaProperties,
  });

  return {
    files,
    name: normalizeName(exportData.frame.settings.packageName),
  };
}
