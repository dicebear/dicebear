import { Style } from '../types.js';
import * as _ from './escape.js';

export function xml(style: Style<any>): string {
  const sourceName = style.meta?.source?.name;
  const sourceUrl = style.meta?.source?.url;
  const creatorName = style.meta?.creator?.name;
  const licenseUrl = style.meta?.license?.url;
  const copyright = text(style);

  if (!sourceName && !creatorName && !sourceUrl && !licenseUrl && !copyright) {
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
    (sourceName ? `<dc:title>${_.xml(sourceName)}</dc:title>` : '') +
    (creatorName ? `<dc:creator>${_.xml(creatorName)}</dc:creator>` : '') +
    (sourceUrl ? `<dc:source xsi:type="dcterms:URI">${_.xml(sourceUrl)}</dc:source>` : '') +
    (licenseUrl ? `<dcterms:license xsi:type="dcterms:URI">${_.xml(licenseUrl)}</dcterms:license>` : '') +
    (copyright ? `<dc:rights>${_.xml(copyright)}</dc:rights>` : '') +
    '</rdf:Description>' +
    '</rdf:RDF>' +
    '</metadata>'
  );
}

export function text(style: Style<any>): string {
  let title = style.meta?.source?.name ? `„${style.meta?.source?.name}”` : 'Design';
  let creator = `„${style.meta?.creator?.name ?? 'Unknown'}”`;

  if (style.meta?.source) {
    title += ` (${style.meta.source})`;
  }

  let result = '';

  if (style.meta?.license?.name !== 'MIT' && style.meta?.creator?.name !== 'DiceBear' && style.meta?.source?.name) {
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
