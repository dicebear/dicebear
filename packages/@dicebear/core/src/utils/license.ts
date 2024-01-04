import { Style } from '../types.js';
import * as _ from './escape.js';

export function xml(style: Style<any>): string | undefined {
    if (!requiresAttribution(style)) {
        return undefined;
    }

    if (!isCreativeCommonsLicense(style)) {
        return `<desc>${text(style)}</desc>`;
    }

    const title = style.meta?.title ?? 'Unnamed';
    const creator = style.meta?.creator ?? 'Unknown';

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
        `<desc>${text(style)}</desc>` +
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
        return `${title} by ${creator}, used under MIT License.`;
    } else {
        return `${title} by ${creator}, used under ${license} / Remix of the original.`;
    }
}

export function isCreativeCommonsLicense(style: Style<any>): boolean {
    return (
        style.meta?.license?.name === 'CC0 1.0' ||
        style.meta?.license?.name === 'CC BY 4.0' ||
        style.meta?.license?.name === 'CC BY-SA 4.0' ||
        style.meta?.license?.name === 'CC BY-NC 4.0' ||
        style.meta?.license?.name === 'CC BY-NC-SA 4.0'
    );
}

export function requiresAttribution(style: Style<any>): boolean {
    // Attribution can be omitted if the designer is Florian Körner and the licence is CC0 1.0.
    return false === (
        style.meta?.creator === 'Florian Körner' &&
        style.meta?.license?.name === 'CC0 1.0'
    );
}
