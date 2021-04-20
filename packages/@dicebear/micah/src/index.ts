/**
 * --------------------------------------------------------------------------
 * DiceBear Micah (@dicebear/micah)
 *
 * Code licensed under MIT (https://github.com/dicebear/dicebear/blob/v4/packages/micah/LICENSE)
 * Copyright (c) 2021 Florian Körner
 *
 * Design "Avatar Illustration System" by Micah Lanier licensed under CC BY 4.0
 * Source: https://www.figma.com/community/file/829741575478342595
 * License: https://creativecommons.org/licenses/by/4.0/
 * --------------------------------------------------------------------------
 */

import { utils } from '@dicebear/avatars';
import { style } from './core';

let { create, meta, schema } = style;

export { create, meta, schema };
export { Options } from './options';

/** @deprecated will be removed in Version 5.0 */
export default utils.style.createLegacyWrapper(style);
