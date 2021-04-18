import type { Options } from '../options';
import type { Style, StyleCreateResult, StyleCreateResultAttributes } from '../types';
import * as escape from './escape';

type CreateGroupProps = {
  children: string;
  x: number;
  y: number;
};

const ccLicenses: Record<string, { permits: string[]; requires: string[]; prohibits: string[] }> = {
  by: {
    permits: ['Reproduction', 'Distribution', 'DerivativeWorks'],
    requires: ['Notice', 'Attribution'],
    prohibits: [],
  },
  'by-sa': {
    permits: ['Reproduction', 'Distribution', 'DerivativeWorks'],
    requires: ['Notice', 'Attribution', 'ShareAlike'],
    prohibits: [],
  },
  'by-nd': {
    permits: ['Reproduction', 'Distribution'],
    requires: ['Notice', 'Attribution'],
    prohibits: [],
  },
  'by-nc': {
    permits: ['Reproduction', 'Distribution', 'DerivativeWorks'],
    requires: ['Notice', 'Attribution'],
    prohibits: ['CommercialUse'],
  },
  'by-nc-sa': {
    permits: ['Reproduction', 'Distribution', 'DerivativeWorks'],
    requires: ['Notice', 'Attribution', 'ShareAlike'],
    prohibits: ['CommercialUse'],
  },
  'by-nc-nd': {
    permits: ['Reproduction', 'Distribution'],
    requires: ['Notice', 'Attribution'],
    prohibits: ['CommercialUse'],
  },
  zero: {
    permits: ['Reproduction', 'Distribution', 'DerivativeWorks'],
    requires: [],
    prohibits: [],
  },
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
  return `
    <metadata>
      <rdf:RDF>
        <cc:Work>
          <dc:format>image/svg+xml</dc:format>
          <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          ${getMetadataWorkTitle(style)}
          ${getMetadataWorkCreator(style)}
          ${getMetadataWorkSource(style)}
          ${getMetadataWorkLicense(style)}
          ${getMetadataWorkContributor(style)}
        </cc:Work>
        ${getMetadataLicense(style)}
      </rdf:RDF>
    </metadata>
  `;
}

export function getMetadataWorkTitle<O extends Options>(style: Style<O>) {
  if (style.meta.title) {
    return `<dc:title>${style.meta.title}</dc:title>`;
  }

  return '';
}

export function getMetadataWorkCreator<O extends Options>(style: Style<O>) {
  if (style.meta.creator) {
    let creators = Array.isArray(style.meta.creator) ? style.meta.creator : [style.meta.creator];

    return `
      <dc:creator>
        ${getMetadataWorkAgents(creators)}
      </dc:creator>
    `;
  }

  return '';
}

export function getMetadataWorkSource<O extends Options>(style: Style<O>) {
  if (style.meta.source) {
    return `<dc:source>${style.meta.source}</dc:source>`;
  }

  return '';
}

export function getMetadataWorkLicense<O extends Options>(style: Style<O>) {
  if (style.meta.license) {
    return `<cc:license rdf:resource="${style.meta.license.url}" />`;
  }

  return '';
}

export function getMetadataWorkContributor<O extends Options>(style: Style<O>) {
  if (style.meta.contributor) {
    let contributors = Array.isArray(style.meta.contributor) ? style.meta.contributor : [style.meta.contributor];

    return `
      <dc:contributor>
        ${getMetadataWorkAgents(contributors)}
      </dc:contributor>
    `;
  }

  return '';
}

export function getMetadataWorkAgents(agents: string[]) {
  return agents.map(
    (agent) => `
      <cc:Agent>
        <dc:title>${agent}</dc:title>
      </cc:Agent>
    `
  );
}

export function getMetadataLicense<O extends Options>(style: Style<O>) {
  let match = style.meta.license?.url.match(
    /^https?:\/\/creativecommons.org\/(?:licenses|publicdomain)\/([a-z\-]+)\/\d.\d\//
  );

  if (match) {
    let license = ccLicenses[match[1]];

    if (license) {
      let result = ``;

      license.permits.forEach((permits) => {
        result += `<cc:permits rdf:resource="https://creativecommons.org/ns#${permits}" />`;
      });

      license.requires.forEach((requires) => {
        result += `<cc:requires rdf:resource="https://creativecommons.org/ns#${requires}" />`;
      });

      license.prohibits.forEach((prohibits) => {
        result += `<cc:prohibits rdf:resource="https://creativecommons.org/ns#${prohibits}" />`;
      });

      return `
        <cc:License rdf:about="${style.meta.license?.url}">
          ${result}
        </cc:License>
      `;
    }
  }

  return '';
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
    <g mask="url(#avatarsRadiusMask)">${result.body}</g>
  `;
}

export function createAttrString(attributes: StyleCreateResultAttributes): string {
  attributes = { ...getXmlnsAttributes(), ...attributes };

  return Object.keys(attributes)
    .map((attr) => `${escape.xml(attr)}="${escape.xml(attributes[attr])}"`)
    .join(' ');
}

export function removeWhitespace(svg: string): string {
  return (
    svg
      // Remove space before tag
      .replace(/[\n\r\s]+</g, '<')
      // Remove space after tag
      .replace(/>[\n\r\s]+/g, '>')
      // Remove breaking lines
      .replace(/[\n\r]+/g, ' ')
      // Reduce whitespace
      .replace(/[\s]{2,}/g, ' ')
      // Create self closing tags
      .replace(/<([^\/>]+)><\/[^>]+>/gi, '<$1/>')
      // Remove whitespace before self tag self close
      .replace(/\s(\/?>)/g, '$1')
  );
}
