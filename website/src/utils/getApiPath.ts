import { StyleOptions } from '@dicebear/avatars';
import * as styles from '@dicebear/collection';
import { stringify } from 'qs';

export function getApiPath<T>(style: keyof typeof styles, { seed, ...options }: StyleOptions<T>) {
  const qs = stringify(options, {
    encodeValuesOnly: true,
    arrayFormat: 'brackets',
  });

  let url = `https://api.dicebear.com/${style}/${encodeURIComponent(seed ?? '')}.svg`;

  if (qs) {
    url += `?${qs}`;
  }

  return url;
}
