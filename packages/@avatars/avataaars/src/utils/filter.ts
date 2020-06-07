import Options from 'src/options';

export function byOptionName<T>(
  options: Options,
  optionName: keyof Options,
  optionValues: Record<string, T>
): Record<string, T> {
  let mode = options.mode === 'exclude';
  let result = { ...optionValues };

  Object.keys(optionValues).forEach((key) => {
    let val = options[optionName] || [key];

    if (Array.isArray(val)) {
      if (mode === val.includes(key)) {
        delete result[key];
      }
    }
  });

  return result;
}
