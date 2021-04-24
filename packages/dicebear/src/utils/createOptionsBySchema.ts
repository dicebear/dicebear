import { Option } from 'commander';
import { utils, StyleSchema } from '@dicebear/avatars';

export function createOptionsBySchema(schema: StyleSchema) {
  const result: InstanceType<typeof Option>[] = [];
  const aliases = utils.schema.aliases(schema);

  for (var key in schema.properties) {
    if (false === schema.properties.hasOwnProperty(key)) {
      continue;
    }

    const property = schema.properties[key];

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

      result.push(option);
    }
  }

  return result;
}
