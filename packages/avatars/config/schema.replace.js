module.exports = {
  files: 'src/schema.json',
  from: /^(.*)$/s,
  to: `import { StyleSchema } from './types';

export const schema: StyleSchema = $1;`,
};
