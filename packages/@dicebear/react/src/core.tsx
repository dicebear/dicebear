import { createAvatar, Style, StyleOptions } from '@dicebear/core';
import * as React from 'react';
import { AvatarProps } from './types';

export function useAvatar<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O>
): string | undefined {
  const [avatar, setAvatar] = React.useState<string | undefined>();

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      const avatar = await createAvatar(style, options).toDataUri();

      if (mounted) {
        setAvatar(avatar);
      }
    })();

    () => {
      mounted = false;
    };
  }, [style, options]);

  return avatar;
}

export function Avatar<O>({ style, options, ...props }: AvatarProps<O>) {
  let avatar = useAvatar(style, options);

  return avatar ? <img src={avatar} {...props} /> : null;
}
