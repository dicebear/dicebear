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

/**
 * @deprecated use addScale instead
 */
export function addMargin<O extends Options>(result: StyleCreateResult, options: O | number) {
  const margin = typeof options === 'number' ? options : options.margin ?? 0;

  return addScale(result, margin * 2);
}

/**
 * @deprecated use addViewboxMask instead
 */
export function addRadius<O extends Options>(result: StyleCreateResult, options: O) {
  if (undefined === options.radius) {
    return result.body;
  }

  return addViewboxMask(result, options.radius);
}

export function addBackgroundColor<O extends Options>(result: StyleCreateResult, options: O | string) {
  let { width, height, x, y } = getViewBox(result);

  let backgroundColor = typeof options === 'string' ? options : options.backgroundColor ?? 'transparent';

  return `
    <rect fill="${backgroundColor}" width="${width}" height="${height}" x="${x}" y="${y}" />
    ${result.body}
  `;
}

export function addScale(result: StyleCreateResult, scale: number) {
  let { width, height, x, y } = getViewBox(result);

  let percent = scale ? (scale - 100) / 100 : 0;

  let translateX = (width / 2 + x) * percent * -1;
  let translateY = (height / 2 + y) * percent * -1;

  return `
    <g transform="translate(${translateX} ${translateY}) scale(${scale / 100})">
      ${result.body}
    </g>
  `;
}

export function addTranslate(result: StyleCreateResult, x?: number, y?: number) {
  let viewBox = getViewBox(result);

  let translateX = (viewBox.width + viewBox.x * 2) * ((x ?? 0) / 100);
  let translateY = (viewBox.height + viewBox.y * 2) * ((y ?? 0) / 100);

  return `
    <g transform="translate(${translateX} ${translateY})">
      ${result.body}
    </g>
  `;
}

export function addRotate(result: StyleCreateResult, rotate: number) {
  let { width, height, x, y } = getViewBox(result);

  return `
    <g transform="rotate(${rotate}, ${width / 2 + x}, ${height / 2 + y})">
      ${result.body}
    </g>
  `;
}

export function addFlip(result: StyleCreateResult) {
  let { width, x } = getViewBox(result);

  return `
    <g transform="scale(-1 1) translate(${width * -1 - x * 2} 0)">
      ${result.body}
    </g>
  `;
}

export function addViewboxMask(result: StyleCreateResult, radius: number) {
  let { width, height, x, y } = getViewBox(result);

  let rx = radius ? (width * radius) / 100 : 0;
  let ry = radius ? (height * radius) / 100 : 0;

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
      // Remove spaces at both ends of the string
      .trim()
      // Remove breaking lines
      .replace(/\n/g, ' ')
      // Remove space between tags
      .replace(/>\s+</g, '><')
      // Reduce whitespace
      .replace(/\s{2,}/g, ' ')
      // Create self closing tags
      .replace(/<([^\/>]+)><\/[^>]+>/gi, '<$1/>')
      // Remove whitespace before tag close
      .replace(/\s(\/?>)/g, '$1')
  );
}
