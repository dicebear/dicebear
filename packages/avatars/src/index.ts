import type { JSONSchema7 } from 'json-schema';

const schema = require('./schema.json') as JSONSchema7;

export { default, SpriteCollection } from './core.legacy';
export * from './core';
export * from './types';
export * from './options';
export * as utils from './utils';
export * as color from './color';
export { schema };
