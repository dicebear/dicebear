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

import { createAvatar } from './core';
import type { Prng, Style, StyleOptions, StyleSchema } from './types';
import { create as createPrng } from './utils/prng';

const schema = untypedSchema as JSONSchema.JSONSchema7;

export { createAvatar, createPrng, schema, Prng, Style, StyleOptions, StyleSchema };
