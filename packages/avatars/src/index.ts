import type { JSONSchema7 } from 'json-schema';
import coreSchema from './schema.json';

const schema = coreSchema as JSONSchema7;

export { default, SpriteCollection } from './core.legacy';
export * from './core';
export * from './types';
export * from './options';
export * as utils from './utils';
export * as color from './color';
export { schema };
