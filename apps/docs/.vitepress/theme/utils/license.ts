import type { AvatarStyleMeta } from '@theme/types';
import { normalizeLicense } from '../config/styleCategories';
import { formatLicenseName } from './format';

// Value imports are relative on purpose: the OG card generator pulls this
// module into the VitePress config bundle, where the `@theme` alias is only
// available to type-only imports (it is declared in config.ts's own `vite`
// block, which is not in effect while the config itself is being bundled).

/**
 * How a style relates to the work it came from.
 *
 *  - `own-work`: DiceBear drew it, so there is nothing to attribute upstream.
 *  - `port`: a faithful port of someone else's work, not a reinterpretation.
 *    `icons` (Bootstrap Icons, MIT) is the only one today.
 *  - `remix`: adapted from someone else's work.
 *
 * This matters legally, not just editorially: CC BY 4.0 §3(a)(1)(B) requires
 * indicating that the licensed material was modified, which is what the
 * "remix" wording carries. The OG cards state it without the page around
 * them, so a card and its style page must not disagree.
 *
 * The license test goes through `normalizeLicense` rather than comparing the
 * raw name, so a definition shipping "MIT License" is still recognized as a
 * port. Every packaged style currently spells it exactly "MIT", so a raw
 * comparison would agree today by luck rather than by construction.
 */
export type AttributionKind = 'own-work' | 'port' | 'remix';

export function attributionKind(meta?: AvatarStyleMeta): AttributionKind {
  if (meta?.creator === 'DiceBear') {
    return 'own-work';
  }

  // Without a source work there is nothing to call a remix *of*, and claiming
  // one would assert a modification the style pages do not: UiLicenseText.vue
  // falls back to "is based on" for exactly this case.
  if (!meta?.title) {
    return 'port';
  }

  return normalizeLicense(formatLicenseName(meta.license?.name)) === 'MIT'
    ? 'port'
    : 'remix';
}

/**
 * Whether a style waives attribution entirely. The OG generator asserts this
 * for the styles on its default card, which carries no credit line.
 */
export function isPublicDomain(meta?: AvatarStyleMeta): boolean {
  return normalizeLicense(formatLicenseName(meta?.license?.name)) === 'CC0 1.0';
}
