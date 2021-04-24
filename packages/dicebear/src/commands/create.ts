import { Command } from 'commander';
import { schema as coreSchema, Style, StyleSchema } from '@dicebear/avatars';
import * as styles from '@dicebear/collection';
import mergeAllOf from 'json-schema-merge-allof';
import { createOptionsBySchema } from '../utils/createOptionsBySchema';
import { createStyleCreateAction } from '../utils/createStyleCreateAction';

const create = new Command('create');

Object.keys(styles).forEach((name) => {
  const style: Style<any> = styles[name as keyof typeof styles];

  const countProperty: StyleSchema = {
    title: 'Count',
    description: 'Defines how many avatars to create. Does not work in combination with a "seed".',
    type: 'number',
    default: 1,
  };

  const formatProperty: StyleSchema = {
    title: 'Format',
    type: 'string',
    enum: ['svg', 'png', 'jpg', 'jpeg'],
    default: 'svg',
  };

  const schema = mergeAllOf(
    {
      allOf: [
        {
          properties: {
            c: countProperty,
            count: countProperty,
            f: formatProperty,
            format: formatProperty,
          },
        },
        coreSchema,
        style.schema,
      ],
      additionalItems: true,
    },
    { ignoreAdditionalProperties: true }
  ) as StyleSchema;

  const styleCommand = new Command(name).arguments('[outputPath]').action(createStyleCreateAction(name, style, schema));

  createOptionsBySchema(schema).forEach((option) => styleCommand.addOption(option));

  create.addCommand(styleCommand);
});

export { create };
