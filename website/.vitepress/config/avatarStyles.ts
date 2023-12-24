import * as collection from '@dicebear/collection';
import { AvatarStyles } from '@shared/types';

const avatarStyles: AvatarStyles = {};

for (const key in collection) {
  const style = collection[key as keyof typeof collection];

  if (style.meta) {
    avatarStyles[key] = {
      schema: style.schema,
      meta: style.meta,
    };
  }
}

export default avatarStyles;
