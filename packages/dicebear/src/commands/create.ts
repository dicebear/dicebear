import { Command, Option } from 'commander';
import { schema as coreSchema, utils, Style, createAvatar, StyleSchema } from '@dicebear/avatars';
import * as styles from '@dicebear/collection';
import mergeAllOf from 'json-schema-merge-allof';
import Ajv from 'ajv';
import * as path from 'path';
import fs from 'fs-extra';

const create = new Command('create');

const validator = new Ajv({
  strict: false,
  coerceTypes: true,
  useDefaults: false,
  removeAdditional: false,
});

Object.keys(styles).forEach((name) => {
  const style: Style<any> = styles[name as keyof typeof styles];
  const schema = mergeAllOf(
    {
      allOf: [
        coreSchema,
        style.schema,
        {
          properties: {
            count: {
              type: 'number',
              default: 1,
            },
          },
        },
      ],
      additionalItems: true,
    },
    { ignoreAdditionalProperties: true }
  ) as StyleSchema;

  const aliases = utils.schema.aliases(schema);
  const properties = { ...schema.properties };
  const validate = validator.compile(schema);

  const countOptions = new Option(
    '-c, --count <value>',
    'Defines how many avatars to create. Does not work in combination with a "seed".'
  ).default(1);

  const styleCommand = new Command(name).arguments('[outputPath]').addOption(countOptions);

  Object.keys(properties).forEach((key) => {
    const property = properties[key];

    const names = aliases.find((v) => v.includes(key)) ?? [key];
    const isPrimary = names[0] === key;

    if (isPrimary && typeof property === 'object') {
      const options = names.map((name) => (name.length === 1 ? `-${name}` : `--${name}`));
      const option = new Option(`${options.join(', ')} <value>`);

      let description = [property.title, property.description].filter((v) => v).join(' - ');
      let choices: string[] = [];

      if (property.enum) {
        choices.push(...(property.enum.filter((v) => typeof v === 'string') as string[]));
      }

      if (typeof property.items === 'object' && 'enum' in property.items && property.items.enum) {
        choices.push(...(property.items.enum.filter((v) => typeof v === 'string') as string[]));
      }

      if (choices.length > 0) {
        description += ` (choices: "${choices.join('", "')})`;
      }

      if (property.default !== undefined && property.default !== null) {
        option.default(typeof property.default === 'boolean' ? property.default : property.default.toString());
      }

      option.description = description;

      styleCommand.addOption(option);
    }
  });

  styleCommand.action(async (outputPath = '.', options = {}) => {
    Object.keys(options).forEach((key) => {
      const property = properties[key];

      if (typeof property === 'object' && property.type === 'array') {
        options[key] = options[key].split(',');
      }
    });

    if (false === validate(options)) {
      if (validate.errors) {
        for (var errorKey in validate.errors) {
          if (validate.errors.hasOwnProperty(errorKey)) {
            new Error(`${errorKey} - ${validate.errors[errorKey]}`);
          }
        }
      }

      throw new Error('Unknown error');
    }

    outputPath = path.resolve(process.cwd(), outputPath);

    await fs.ensureDir(outputPath);

    let promises = [];

    for (let i = 0; i < options.count; i++) {
      promises.push(
        (async () => {
          const avatar = createAvatar(style, options);
          const fileName = path.resolve(outputPath, `${name}-${i}.svg`);

          await fs.writeFile(fileName, avatar, { encoding: 'utf-8' });
        })()
      );
    }

    await Promise.all(promises);
  });

  create.addCommand(styleCommand);
});

export { create };
