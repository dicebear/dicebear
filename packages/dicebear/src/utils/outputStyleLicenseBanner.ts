// @ts-ignore
import type { Style } from '@dicebear/core';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';

export function outputStyleLicenseBanner(name: string, style: Style<any>) {
  let banner = ['-'.repeat(64)];
  let creator = Array.isArray(style.meta?.creator)
    ? style.meta?.creator.join(', ')
    : style.meta?.creator;

  if (style.meta?.title && creator) {
    banner.push(chalkTemplate`{bold ${style.meta.title}} by {bold ${creator}}`);
  } else if (style.meta?.title) {
    banner.push(chalkTemplate`{bold ${style.meta.title}}`);
  } else if (creator) {
    banner.push(chalkTemplate`{bold ${name}} by {bold ${creator}}`);
  }

  banner.push('');

  if (style.meta?.homepage) {
    banner.push(`Homepage: ${style.meta.homepage}`);
  }

  if (style.meta?.source) {
    banner.push(`Source: ${style.meta.source}`);
  }

  if (style.meta?.license) {
    banner.push(
      `License: ${style.meta.license.name} - ${style.meta.license.url}`
    );
  }

  banner.push('-'.repeat(64));
  banner.push('');

  console.log(chalk.blueBright(banner.join('\n')));
}
