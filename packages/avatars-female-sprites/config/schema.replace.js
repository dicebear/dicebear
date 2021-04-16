module.exports = {
  files: 'src/schema.json',
  from: /^(.*)$/s,
  to: `import { StyleSchema } from '@dicebear/avatars';

export const schema: StyleSchema = $1;`,
};
