import { Exif, Style } from '../types.js';
import * as _ from './escape.js';

export function xml(style: Style<any>): string {
  const title = style.meta?.title;
  const creator = style.meta?.creator;
  const source = style.meta?.source;
  const license = style.meta?.license?.url;
  const rights = text(style);

  if (!title && !creator && !source && !license && !rights) {
    return '';
  }

  // https://nsteffel.github.io/dublin_core_generator/generator.html
  return (
    '<metadata' +
    ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
    ' xmlns:dcterms="http://purl.org/dc/terms/">' +
    '<rdf:RDF>' +
    '<rdf:Description>' +
    (title ? `<dc:title>${_.xml(title)}</dc:title>` : '') +
    (creator ? `<dc:creator>${_.xml(creator)}</dc:creator>` : '') +
    (source ? `<dc:source xsi:type="dcterms:URI">${_.xml(style.meta?.source ?? '')}</dc:source>` : '') +
    (license ? `<dcterms:license xsi:type="dcterms:URI">${_.xml(license)}</dcterms:license>` : '') +
    (rights ? `<dc:rights>${_.xml(rights)}</dc:rights>` : '') +
    '</rdf:Description>' +
    '</rdf:RDF>' +
    '</metadata>'
  );
}

export function text(style: Style<any>): string {
  let title = style.meta?.title ? `„${style.meta?.title}”` : 'Design';
  let creator = `„${style.meta?.creator ?? 'Unknown'}”`;

  if (style.meta?.source) {
    title += ` (${style.meta.source})`;
  }

  let result = '';
  
  if (style.meta?.license?.name !== 'MIT' && style.meta?.creator !== 'DiceBear' && style.meta?.title) {
    result += 'Remix of ';
  }

  result += `${title} by ${creator}`;

  if (style.meta?.license?.name) {
    result += `, licensed under „${style.meta?.license?.name}”`;

    if (style.meta?.license?.url) {
      result += ` (${style.meta.license.url})`;
    }
  }

  return result;
}

export function exif(style: Style<any>): Exif {
  const copyright = text(style);

  // https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata
  // https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
  return {
    // Title
    'IPTC:ObjectName': style.meta?.title,
    'XMP-dc:Title': style.meta?.title,

    // Copyright
    'IPTC:CopyrightNotice': copyright,
    'XMP-dc:Rights': copyright,

    // Creator
    'IPTC:By-line': style.meta?.creator,
    'XMP-dc:Creator': style.meta?.creator,

    // Credit
    'IPTC:Credit': style.meta?.creator,
    'XMP-photoshop:Credit': style.meta?.creator,

    // Licensor
    'XMP-plus:LicensorURL': style.meta?.source,

    // Rights
    'XMP-xmpRights:WebStatement': style.meta?.license?.url,
  } as Exif;
}
