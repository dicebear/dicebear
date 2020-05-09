import Options from '../options';

export default function(options: Options) {
  let avatarStyle = 'Transparent';

  switch (options.style) {
    case 'circle':
      return 'Circle';

    case 'transparent':
      return 'Transparent';
  }

  return avatarStyle;
}
