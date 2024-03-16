import { Style } from '@dicebear/core';
import * as collection from '@dicebear/collection/async';
import { paramCase } from 'change-case';

export function loadAvatarStyle(avatarStyle: string): Promise<Style<any>> {
  // @ts-ignore
  if (typeof collection[avatarStyle] === 'undefined') {
    throw new Error(`Avatar style "${avatarStyle}" not found.`);
  }

  // @ts-ignore
  return collection[avatarStyle]();
}

export function getAvatarApiUrl(
  avatarStyle: string,
  options: Record<string, unknown> = {},
  format: string = 'svg'
): string {
  const qs = Object.entries(options)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v.length === 0
          ? `${encodeURIComponent(k)}[]`
          : `${encodeURIComponent(k)}=${v
              .map((c) => encodeURIComponent(c))
              .join(',')}`;
      }

      if (
        typeof v == 'string' ||
        typeof v == 'number' ||
        typeof v == 'boolean'
      ) {
        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
      }

      throw new Error(`Invalid value for "${k}"`);
    })
    .join('&');

  return `https://api.dicebear.com/8.x/${paramCase(avatarStyle)}/${format}${
    qs ? `?${qs}` : ''
  }`;
}

export function getAvatarApiCommand(
  avatarStyle: string,
  options: Record<string, unknown> = {}
): string {
  const args = Object.entries(options)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `  --${k} ${v
          .map((c) => `'${c.replace(/\\/g, '\\\\').replace(/'/g, "'\\''")}'`)
          .join(' ')}`.trimEnd();
      }

      if (typeof v == 'number' || typeof v == 'boolean') {
        return `  --${k} ${v}`;
      }

      if (typeof v == 'string') {
        return `  --${k} '${v.replace(/\\/g, '\\\\').replace(/'/g, "'\\''")}'`;
      }

      throw new Error(`Invalid value for "${k}"`);
    })
    .join(' \\\n');

  return `dicebear ${avatarStyle} .${
    args.length > 0 ? ` \\\n${args}` : ''
  }`.trim();
}

export function getAvatarPropertyPreviewOptions(
  propertyName: string,
  propertyValue: unknown
): Record<string, unknown> {
  if (propertyName === 'seed') {
    return {
      [propertyName]: propertyValue,
    };
  }

  if (propertyName === 'backgroundType') {
    return {
      backgroundColor: ['6d28d9', 'c026d3'],
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName === 'backgroundRotation') {
    return {
      backgroundColor: ['3f3f46', 'd4d4d8'],
      backgroundType: ['gradientLinear'],
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName.match(/Color$/)) {
    const probabilityName = propertyName.replace(/Color$/, 'Probability');

    return {
      seed: 'JD',
      [probabilityName]: 100,
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName.match(/Probability$/)) {
    return {
      seed: 'JD',
      [propertyName]: propertyValue,
    };
  }

  if (
    propertyName.match(/OffsetX$/) ||
    propertyName.match(/OffsetY$/) ||
    propertyName.match(/Rotation$/)
  ) {
    return {
      seed: 'JD',
      [propertyName]: [propertyValue],
    };
  }

  return {
    seed: 'JD',
    [`${propertyName}Probability`]: 100,
    [propertyName]:
      typeof propertyValue === 'string' ? [propertyValue] : propertyValue,
  };
}
