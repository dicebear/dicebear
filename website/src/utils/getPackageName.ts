import * as styles from '@dicebear/collection';

export function getPackageName(style: keyof typeof styles) {
  if (
    ['avataaars', 'bottts', 'female', 'gridy', 'human', 'identicon', 'initials', 'jdenticon', 'male'].includes(style)
  ) {
    return `@dicebear/avatars-${style}-sprites`;
  }

  return `@dicebear/${style}`;
}
