import { Format } from '@dicebear/converter';
import { createAvatar, Style, StyleOptions } from '@dicebear/core';
import * as React from 'react';
import { AvatarProps } from './types';

export function useAvatar<O extends {}>(
  style: Style<O>,
  options: StyleOptions<O> = {},
  format: Format = 'svg'
): string | undefined {
  const [avatar, setAvatar] = React.useState<string | undefined>();

  // Avoids new avatars after re-rendering if no seed is set.
  const stickySeed = React.useMemo<string>(() => Math.random().toString(), []);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      let avatar = createAvatar(style, {
        ...options,
        seed: options.seed ?? stickySeed,
      });

      let dataUri: string;

      switch (format) {
        case 'svg':
          dataUri = await avatar.toDataUri();
          break;

        case 'png':
          dataUri = await avatar.png().toDataUri();
          break;

        case 'jpeg':
          dataUri = await avatar.jpeg().toDataUri();
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      if (mounted) {
        setAvatar(dataUri);
      }
    })();

    () => {
      mounted = false;
    };
  }, [style, options, format, stickySeed]);

  return avatar;
}

export function Avatar<O>({ style, options, ...props }: AvatarProps<O>) {
  let avatar = useAvatar(style, options);

  return avatar ? <img src={avatar} {...props} /> : null;
}
