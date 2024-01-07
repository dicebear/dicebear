import type { SelectedStyleOptions } from '@/types';
import type { Result } from '@dicebear/core';
import { createAvatar as createAvatarCore } from '@dicebear/core';
import getAvatarOptions from './getAvatarOptions';
import availableStyles from '@/config/styles';

export function createAvatar(
  styleName: string,
  options: SelectedStyleOptions
): Result {
  return createAvatarCore(
    availableStyles[styleName].style,
    getAvatarOptions(styleName, options)
  );
}
