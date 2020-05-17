import Options from '../options';

export default function (options: Options) {
  switch (options.style) {
    case 'circle':
      return 'Circle';

    default:
      return 'Transparent';
  }
}
