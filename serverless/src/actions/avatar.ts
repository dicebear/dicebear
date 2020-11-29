import Avatars from '@dicebear/avatars';

import avataaars from '@dicebear/avatars-avataaars-sprites';
import bottts from '@dicebear/avatars-bottts-sprites';
import female from '@dicebear/avatars-female-sprites';
import gridy from '@dicebear/avatars-gridy-sprites';
import human from '@dicebear/avatars-human-sprites';
import identicon from '@dicebear/avatars-identicon-sprites';
import initials from '@dicebear/avatars-initials-sprites';
import jdenticon from '@dicebear/avatars-jdenticon-sprites';
import male from '@dicebear/avatars-male-sprites';

import avataaarsOptions from '../options/avataaars';
import botttsOptions from '../options/bottts';
import femaleOptions from '../options/female';
import gridyOptions from '../options/gridy';
import humanOptions from '../options/human';
import identiconOptions from '../options/identicon';
import initialsOptions from '../options/initials';
import jdenticonOptions from '../options/jdenticon';
import maleOptions from '../options/male';

const styles: Record<string, [any, any]> = {
  avataaars: [avataaars, avataaarsOptions],
  bottts: [bottts, botttsOptions],
  female: [female, femaleOptions],
  gridy: [gridy, gridyOptions],
  human: [human, humanOptions],
  identicon: [identicon, identiconOptions],
  initials: [initials, initialsOptions],
  jdenticon: [jdenticon, jdenticonOptions],
  male: [male, maleOptions],
};

export async function avatarMain(props: any) {
  let route = decodeURIComponent(props.__ow_path).match(/^\/(?:api(?:\/\d+\.\d+)?|v2)\/([a-z]+)\/([^\/]*)\.svg$/);
  let requestOptions = props['options'] || props || {};

  if (null === route) {
    return {
      body: '404 Not Found',
      statusCode: 404,
    };
  }

  let [style, options] = styles[route[1]] || [];

  if (undefined === style) {
    return {
      body: '404 Not Found',
      statusCode: 404,
    };
  }

  try {
    await options.validate(requestOptions);
  } catch (e) {
    return {
      body: e['errors'].join(''),
      statusCode: 400,
    };
  }

  let seed = route[2];
  let avatars = new Avatars(style);
  let svg = avatars.create(seed, options.cast(requestOptions));

  return {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${60 * 60 * 24 * 365}, s-maxage=0`,
    },
    body: Buffer.from(svg).toString('base64'),
    statusCode: 200,
  };
}
