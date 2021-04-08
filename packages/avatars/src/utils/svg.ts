import type { Options } from '../options';
import type { Style, StyleCreateResult, StyleCreateResultAttributes } from '../types';
import * as escape from './escape';

type CreateGroupProps = {
  children: string;
  x: number;
  y: number;
};

export function createGroup({ children, x, y }: CreateGroupProps) {
  return `<g transform="translate(${x}, ${y})">${children}</g>`;
}

export function getXmlnsAttributes() {
  return {
    'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    'xmlns:cc': 'http://creativecommons.org/ns#',
    'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'xmlns:svg': 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/svg',
  };
}

export function getMetadata<O extends Options>(style: Style<O>) {
  let isCcBy40 = 'CC BY 4.0' === style.meta.license?.name;
  let isCcZero10 = 'CC0 1.0' === style.meta.license?.name;
  let isCc = isCcBy40 || isCcZero10;

  if (Object.keys(style.meta).length === 0) {
    return '';
  }

  return `
    <metadata>
      <rdf:RDF>
        <cc:Work rdf:about="">
          <dc:format>image/svg+xml</dc:format>
          <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          ${style.meta.title ? `<dc:title>${style.meta.title}</dc:title>` : ''}
          ${style.meta.license ? `<cc:license rdf:resource="${style.meta.license.link}" />` : ''}
          ${
            style.meta.creator
              ? `<dc:creator>
                  <cc:Agent>
                    <dc:title>${style.meta.creator}</dc:title>
                  </cc:Agent>
                </dc:creator>`
              : ''
          }
          ${style.meta.source ? `<dc:source>${style.meta.source}</dc:source>` : ''}
        </cc:Work>
        ${
          isCc
            ? `
              <cc:License rdf:about="${style.meta.license.link}">
                <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
                <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
                ${isCcBy40 ? '<cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />' : ''}
                ${isCcBy40 ? '<cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />' : ''}
                <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
              </cc:License>
            `
            : ''
        }
      </rdf:RDF>
    </metadata>
  `;
}

export function getViewBox(result: StyleCreateResult) {
  let viewBox = result.attributes['viewBox'].split(' ');
  let x = parseInt(viewBox[0]);
  let y = parseInt(viewBox[1]);
  let width = parseInt(viewBox[2]);
  let height = parseInt(viewBox[3]);

  return {
    x,
    y,
    width,
    height,
  };
}

export function addMargin<O extends Options>(result: StyleCreateResult, options: O) {
  if (undefined === options.margin) {
    return result.body;
  }

  let viewBox = getViewBox(result);
  let translateX = (viewBox.width * options.margin) / 100;
  let translateY = (viewBox.height * options.margin) / 100;
  let scale = 1 - (options.margin * 2) / 100;
  let rectWidth = viewBox.width.toString();
  let rectHeight = viewBox.height.toString();
  let rectX = viewBox.x.toString();
  let rectY = viewBox.y.toString();

  return `
    <g transform="${`translate(${translateX}, ${translateY})`}">
      <g transform="${`scale(${scale})`}">
        <rect fill="none" width="${rectWidth}" height="${rectHeight}" x="${rectX}" y="${rectY}" />
        ${result.body}
      </g>
    </g>
  `;
}

export function addBackgroundColor<O extends Options>(result: StyleCreateResult, options: O) {
  let viewBox = getViewBox(result);
  let width = viewBox.width.toString();
  let height = viewBox.height.toString();
  let x = viewBox.x.toString();
  let y = viewBox.y.toString();

  return `
    <rect fill="${options.backgroundColor}" width="${width}" height="${height}" x="${x}" y="${y}" />
    ${result.body}
  `;
}

export function addRadius<O extends Options>(result: StyleCreateResult, options: O) {
  if (undefined === options.radius) {
    return result.body;
  }

  let viewBox = getViewBox(result);
  let width = viewBox.width.toString();
  let height = viewBox.height.toString();
  let rx = ((viewBox.width * options.radius) / 100).toString();
  let ry = ((viewBox.height * options.radius) / 100).toString();
  let x = viewBox.x.toString();
  let y = viewBox.y.toString();

  return `
    <mask id="avatarsRadiusMask">
      <rect width="${width}" height="${height}" rx="${rx}" ry="${ry}" x="${x}" y="${y}" fill="#fff" />
    </mask>
    <g mask="url(#avatarsRadiusMask)>${result.body}</g>
  `;
}

export function createAttrString(attributes: StyleCreateResultAttributes): string {
  attributes = { ...getXmlnsAttributes(), ...attributes };

  return Object.keys(attributes)
    .map((attr) => `${escape.xml(attr)}="${escape.xml(attributes[attr])}"`)
    .join(' ');
}
