/*!
 * DiceBear (@dicebear/core)
 *
 * Code licensed under MIT (https://github.com/dicebear/dicebear/blob/main/LICENSE)
 * Copyright (c) 2021 Florian Körner
 */

import { JSONSchema7 } from 'json-schema';
import untypedSchema from './schema.json';

export const schema = untypedSchema as JSONSchema7;

export * from './core';
export * from './types';
export * from './options';
export * as utils from './utils';
