/*!
 * DiceBear (@dicebear/core)
 *
 * Code licensed under MIT (https://github.com/dicebear/dicebear/blob/main/LICENSE)
 * Copyright (c) 2021 Florian Körner
 */

// parcel bug workaround
import type * as JSONSchema from 'json-schema';
// import type { JSONSchema7 } from 'json-schema';
import untypedSchema from './schema.json';

const schema = untypedSchema as JSONSchema.JSONSchema7;

export { schema };
export { createAvatar, createPreview } from './core';
export { create as createPrng } from './utils/prng';
export type { Prng, Style, StyleOptions, StyleSchema } from './types';
