import { Style } from '../types.js';
import * as _ from './escape.js';

export function xml(style: Style<any>): string | undefined {
  if (!requiresAttribution(style)) {
    return undefined;
  }

  const title = style.meta?.title ?? 'Unnamed';

  let creator = style.meta?.creator ?? 'Unknown';

  if (style.meta?.homepage) {
    creator += ` - ${style.meta.homepage}`;
  }

  let license = style.meta?.license?.name ?? 'Unknown';

  if (style.meta?.license?.url) {
    license += ` - ${style.meta.license.url}`;
  }

  return (
    `<desc>${text(style)}</desc>` +
    '<metadata' +
    ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
    ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
    '<rdf:RDF>' +
    '<rdf:Description>' +
    `<dc:title>${_.xml(title)}</dc:title>` +
    `<dc:creator>${_.xml(creator)}</dc:creator>` +
    `<dc:source>${_.xml(style.meta?.source ?? '')}</dc:source>` +
    `<dc:rights>${license}</dc:rights>` +
    `<dc:description>Remix of the original</dc:description>` +
    '</rdf:Description>' +
    '</rdf:RDF>' +
    '</metadata>'
  );
}

export function text(style: Style<any>): string | undefined {
  if (!requiresAttribution(style)) {
    return undefined;
  }

  let title = style.meta?.title ?? 'Unnamed';
  let creator = style.meta?.creator ?? 'Unknown';
  let license = style.meta?.license?.name ?? 'Unknown';

  if (style.meta?.source) {
    title += ` (${style.meta.source})`;
  }

  if (style.meta?.homepage) {
    creator += ` (${style.meta.homepage})`;
  }

  if (style.meta?.license?.url) {
    license += ` (${style.meta.license.url})`;
  }

  if (style.meta?.license?.name === 'MIT') {
    return `${title} by ${creator}, used under ${license}.`;
  } else {
    return `${title} by ${creator}, used under ${license} / Remix of the original.`;
  }
}

function requiresAttribution(style: Style<any>): boolean {
  // Attribution can be omitted if the designer is Florian Körner and the licence is CC0 1.0.
  return (
    false ===
    (style.meta?.creator === 'Florian Körner' &&
      style.meta?.license?.name === 'CC0 1.0')
  );
}
