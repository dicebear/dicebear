import { Option } from 'commander';
import { JSONSchema7 } from 'json-schema';

export async function getOptionsBySchema(schema: JSONSchema7) {
  const result: InstanceType<typeof Option>[] = [];

  for (var key in schema.properties) {
    if (false === schema.properties.hasOwnProperty(key)) {
      continue;
    }

    const property = schema.properties[key];

    if (typeof property === 'object') {
      const option = new Option(`-${key} <value>`);

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
