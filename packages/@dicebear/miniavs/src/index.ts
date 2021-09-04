/*!
 * Miniavs - Free Avatar Creator (@dicebear/miniavs)
 *
 * Code licensed under MIT License.
 * Copyright (c) 2021 Florian Körner
 *
 * Design "Miniavs - Free Avatar Creator" by Webpixels licensed under CC BY 4.0.
 * Source: https://www.figma.com/community/file/923211396597067458
 * License: https://creativecommons.org/licenses/by/4.0/
 */

import { utils } from '@dicebear/avatars';
import { style } from './core';

let { create, meta, schema } = style;

export { create, meta, schema };
export { Options } from './options';

/** @deprecated will be removed in Version 5.0 */
export default utils.style.createLegacyWrapper(style);
