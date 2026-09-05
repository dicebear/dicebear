import type { Style } from '@dicebear/core';
import { chalkStderr } from 'chalk';
import chalkTemplate from 'chalk-template';

/**
 * Prints a colorized attribution banner with the style's source, creator,
 * and license info to stderr, so it never mixes with an avatar written to
 * stdout. Skipped sections are omitted silently.
 */
export function outputStyleLicenseBanner(name: string, style: Style) {
  const meta = style.meta();
  const sourceName = meta.source().name();
  const creatorName = meta.creator().name();
  const sourceUrl = meta.source().url();
  const licenseName = meta.license().name();
  const licenseUrl = meta.license().url();

  const banner = ['-'.repeat(64)];

  if (sourceName && creatorName) {
    banner.push(chalkTemplate`{bold ${sourceName}} by {bold ${creatorName}}`);
  } else if (sourceName) {
    banner.push(chalkTemplate`{bold ${sourceName}}`);
  } else if (creatorName) {
    banner.push(chalkTemplate`{bold ${name}} by {bold ${creatorName}}`);
  }

  banner.push('');

  if (sourceUrl) {
    banner.push(`Source: ${sourceUrl}`);
  }

  if (licenseName) {
    banner.push(
      `License: ${licenseName}${licenseUrl ? ` - ${licenseUrl}` : ''}`,
    );
  }

  banner.push('-'.repeat(64));
  banner.push('');

  console.error(chalkStderr.blueBright(banner.join('\n')));
}
