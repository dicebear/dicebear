import { Exif, Style } from '../types.js';
import * as _ from './escape.js';

export function xml(style: Style<any>): string {
  const title = style.meta?.title ?? 'Unnamed';
  const creator = style.meta?.creator ?? 'Unknown';

  let description = `"${title}" by "${creator}"`;

  if (style.meta?.license?.name) {
    description += `, licensed under "${style.meta.license.name}".`;
  }

  description += ' / Remix of the original. - Created with dicebear.com';

  const xmlTitle = `<dc:title>${_.xml(title)}</dc:title>`;

  const xmlCreator =
    '<dc:creator>' +
    `<cc:Agent rdf:about="${_.xml(style.meta?.homepage ?? '')}">` +
    `<dc:title>${_.xml(creator)}</dc:title>` +
    '</cc:Agent>' +
    '</dc:creator>';

  const xmlSource = style.meta?.source
    ? `<dc:source>${_.xml(style.meta.source)}</dc:source>`
    : '';

  const xmlLicense = style.meta?.license?.url
    ? `<cc:license rdf:resource="${_.xml(style.meta.license.url)}" />`
    : '';

  return (
    `<desc>${description}</desc>` +
    '<metadata' +
    ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
    ' xmlns:cc="http://creativecommons.org/ns#"' +
    ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
    '<rdf:RDF>' +
    '<cc:Work>' +
    xmlTitle +
    xmlCreator +
    xmlSource +
    xmlLicense +
    '</cc:Work>' +
    '</rdf:RDF>' +
    '</metadata>'
  );
}

export function exif(style: Style<any>): Exif {
  const title = style.meta?.title ?? 'Unnamed';
  const creator = style.meta?.creator ?? 'Unknown';

  let copyright = `"${title}" by "${creator}"`;

  if (style.meta?.license?.name) {
    copyright += `, licensed under "${style.meta.license.name}".`;
  }

  copyright += ' / Remix of the original.';

  const exif: Exif = {
    ImageDescription: `${copyright} - Created with dicebear.com`,
    Copyright: copyright,
    'XMP-dc:Title': title,
    'XMP-dc:Creator': creator,
  };

  if (style.meta?.source) {
    exif['XMP-dc:Source'] = style.meta.source;
  }

  if (style.meta?.license?.url) {
    exif['XMP-cc:License'] = style.meta.license.url;
  }

  return exif;
}
