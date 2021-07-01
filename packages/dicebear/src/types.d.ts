import { JSONSchema7 } from 'json-schema';

export type Style = {
  schema: JSONSchema7;
};

declare module '@dicebear/avatars' {
  export default Style;
}
