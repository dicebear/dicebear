import type { ConfigStyleOptions, SelectedStyleOptions } from '@/types';
import getRandomBoolean from '@/utils/getRandomBoolean';
import getRandomNumber from '@/utils/getRandomNumber';

export default function getRandomOptions(
  configStyleOptions: ConfigStyleOptions
): SelectedStyleOptions {
  const result: SelectedStyleOptions = {};

  for (const key in configStyleOptions) {
    if (false === configStyleOptions.hasOwnProperty(key)) {
      continue;
    }

    const styleOption = configStyleOptions[key];
    const values = styleOption.values;

    if (getRandomBoolean(styleOption.probability)) {
      const possibleValues = values.filter((v) => v);
      result[key] =
        possibleValues[getRandomNumber(0, possibleValues.length - 1)];
    } else {
      result[key] = values[0];
    }
  }

  return result;
}
