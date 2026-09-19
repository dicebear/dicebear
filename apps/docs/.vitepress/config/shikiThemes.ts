import type { ThemeRegistration } from 'shiki';

/**
 * Code colors of the docs: ink for code, the brand blue for keywords, a warm
 * tone for strings and muted italics for comments. Two themes, one per mode,
 * built from the same scope list.
 */
function theme(
  name: string,
  type: 'light' | 'dark',
  c: { ink: string; brand: string; string: string; muted: string; bg: string },
): ThemeRegistration {
  return {
    name,
    type,
    colors: {
      'editor.foreground': c.ink,
      'editor.background': c.bg,
    },
    tokenColors: [
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: c.muted, fontStyle: 'italic' },
      },
      {
        scope: [
          'string',
          'string.quoted',
          'string.template',
          'punctuation.definition.string',
        ],
        settings: { foreground: c.string },
      },
      {
        scope: [
          'keyword',
          'storage',
          'storage.type',
          'storage.modifier',
          'keyword.control',
          'keyword.operator.new',
          'constant.language',
          'entity.name.tag',
          'support.type.property-name.json',
          'variable.language',
        ],
        settings: { foreground: c.brand },
      },
      {
        scope: ['keyword.operator', 'punctuation'],
        settings: { foreground: c.ink },
      },
    ],
  };
}

export const shikiLight = theme('dicebear-light', 'light', {
  ink: '#0B1620',
  brand: '#0369A1',
  string: '#9A3412',
  muted: '#5F6D79',
  bg: '#F1F4F6',
});

export const shikiDark = theme('dicebear-dark', 'dark', {
  ink: '#E6EDF3',
  brand: '#7DD3FC',
  string: '#FDBA74',
  muted: '#8595A3',
  bg: '#16202A',
});
