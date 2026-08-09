/**
 * Generates the README badges as static SVGs under `badges/` in the build
 * output, so the README does not have to embed shields.io. A shields.io badge
 * hands the reader's IP to a third party on every render outside GitHub's camo
 * proxy, npmjs.com in particular, and these three badges carry data the site
 * already has: the star count fetched in config.ts and the version of
 * @dicebear/core.
 *
 * The trade-off is freshness. The star count is baked in at build time and the
 * website deploys on demand, so the badge lags the real count between deploys.
 *
 * Text is positioned from an estimated width and then pinned with
 * `textLength`, because the SVG renders with whatever font the reader's system
 * substitutes for Verdana. Without the pin, a wider fallback overflows the
 * colored box.
 */
import { siGithub, siNpm } from 'simple-icons';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const HEIGHT = 20;
const FONT_SIZE = 11;
const PADDING = 6;
const ICON_SIZE = 14;
const ICON_GAP = 4;

const LABEL_BG = '#3f3f46';
const VALUE_BG = '#0284c7';

/**
 * Approximate Verdana 11px advance widths. Only accurate enough to keep the
 * boxes visually balanced; `textLength` makes the glyphs match whatever this
 * returns.
 */
function textWidth(text: string): number {
  let width = 0;

  for (const char of text) {
    if (/[ijlt.,:'!|]/.test(char)) {
      width += 3.5;
    } else if (/[mwMW]/.test(char)) {
      width += 10;
    } else if (/[A-Z]/.test(char)) {
      width += 8;
    } else {
      width += 6.5;
    }
  }

  return Math.ceil(width);
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[char]!,
  );
}

function label(text: string, x: number): string {
  const width = textWidth(text);

  return `<text x="${x}" y="14" textLength="${width}" lengthAdjust="spacingAndGlyphs">${escapeXml(text)}</text>`;
}

interface BadgeOptions {
  name: string;
  labelText: string;
  /** Omitted for a single-segment badge, the fallback when data is missing. */
  valueText?: string;
  iconPath?: string;
}

function renderBadge({
  name,
  labelText,
  valueText,
  iconPath,
}: BadgeOptions): string {
  const iconWidth = iconPath ? ICON_SIZE + ICON_GAP : 0;
  const labelWidth = PADDING + iconWidth + textWidth(labelText) + PADDING;
  const valueWidth = valueText ? PADDING + textWidth(valueText) + PADDING : 0;
  const total = labelWidth + valueWidth;

  const alt = valueText ? `${labelText}: ${valueText}` : labelText;
  const clipId = `badge-${name}`;

  // simple-icons paths use a 24x24 viewBox.
  const icon = iconPath
    ? `<path transform="translate(${PADDING} ${(HEIGHT - ICON_SIZE) / 2}) scale(${ICON_SIZE / 24})" d="${iconPath}" fill="#fff"/>`
    : '';

  const valueSegment = valueText
    ? `<rect x="${labelWidth}" width="${valueWidth}" height="${HEIGHT}" fill="${VALUE_BG}"/>`
    : '';

  const valueLabel = valueText ? label(valueText, labelWidth + PADDING) : '';

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${HEIGHT}" viewBox="0 0 ${total} ${HEIGHT}" role="img" aria-label="${escapeXml(alt)}">`,
    `<title>${escapeXml(alt)}</title>`,
    `<clipPath id="${clipId}"><rect width="${total}" height="${HEIGHT}" rx="3" fill="#fff"/></clipPath>`,
    `<g clip-path="url(#${clipId})">`,
    `<rect width="${labelWidth}" height="${HEIGHT}" fill="${LABEL_BG}"/>`,
    valueSegment,
    `</g>`,
    `<g fill="#fff" font-family="Verdana,DejaVu Sans,Geneva,sans-serif" font-size="${FONT_SIZE}">`,
    icon,
    label(labelText, PADDING + iconWidth),
    valueLabel,
    `</g>`,
    `</svg>`,
  ].join('');
}

/**
 * @param stars Pre-formatted star count, or undefined when the GitHub request
 *   in config.ts failed. The badge then drops its value segment instead of
 *   breaking the image in the README.
 */
export async function generateBadges(
  outDir: string,
  stars: string | undefined,
  coreVersion: string,
): Promise<void> {
  const badges: BadgeOptions[] = [
    stars
      ? {
          name: 'stars',
          labelText: 'stars',
          valueText: stars,
          iconPath: siGithub.path,
        }
      : { name: 'stars', labelText: 'Star on GitHub', iconPath: siGithub.path },
    {
      name: 'npm',
      labelText: 'npm',
      valueText: `v${coreVersion}`,
      iconPath: siNpm.path,
    },
    { name: 'license', labelText: 'license', valueText: 'MIT' },
  ];

  const dir = path.join(outDir, 'badges');
  await fs.mkdir(dir, { recursive: true });

  await Promise.all(
    badges.map((badge) =>
      fs.writeFile(path.join(dir, `${badge.name}.svg`), renderBadge(badge)),
    ),
  );

  console.log(`[badges] wrote ${badges.length} badges to ${dir}`);
}
