import Options from '../options';

export default function (key: keyof Options, value: string, options: Options) {
  let mode = options.mode || 'include';

  let optionValue: any = options[key];

  if (Array.isArray(optionValue)) {
    switch (mode) {
      case 'include':
        return optionValue.indexOf(value) !== -1;

      case 'exclude':
        return optionValue.indexOf(value) === -1;
    }
  }

  return true;
}
