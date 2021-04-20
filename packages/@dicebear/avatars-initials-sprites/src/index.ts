/**
 * --------------------------------------------------------------------------
 * DiceBear Initials (@dicebear/avatars-initials-sprites)
 *
 * Code licensed under MIT (https://github.com/dicebear/dicebear/blob/v4/packages/avatars-initials-sprites/LICENSE)
 * Copyright (c) 2021 Florian Körner
 * --------------------------------------------------------------------------
 */

import { utils } from '@dicebear/avatars';
import { style } from './core';

let { create, meta, schema } = style;

export { create, meta, schema };
export { Options } from './options';

/** @deprecated will be removed in Version 5.0 */
export default utils.style.createLegacyWrapper(style);
