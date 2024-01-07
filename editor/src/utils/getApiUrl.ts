import type { SelectedStyleOptions } from '@/types';
import { paramCase } from 'change-case';
import getAvatarOptions from '@/utils/getAvatarOptions';

export default function getApiUrl(
  styleName: string,
  options: SelectedStyleOptions,
  format: string = 'svg'
) {
  const qs = Object.entries(getAvatarOptions(styleName, options))
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v.length === 0
          ? `${encodeURIComponent(k)}[]`
          : `${encodeURIComponent(k)}=${v
              .map((c) => encodeURIComponent(c))
              .join(',')}`;
      }

      if (
        typeof v == 'string' ||
        typeof v == 'number' ||
        typeof v == 'boolean'
      ) {
        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
      }

      throw new Error(`Invalid value for "${k}"`);
    })
    .join('&');

  return `https://api.dicebear.com/6.x/${paramCase(styleName)}/${format}${
    qs ? `?${qs}` : ''
  }`;
}
