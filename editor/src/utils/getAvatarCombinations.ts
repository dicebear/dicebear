import availableStyles from '@/config/styles';
import type { SelectedStyleCombinations, SelectedStyleOptions } from '@/types';
import { createAvatar } from './createAvatar';

export default function getAvatarCombinations(
  styleName: string,
  selectedStyleOptions: SelectedStyleOptions
): SelectedStyleCombinations {
  const combinations: SelectedStyleCombinations = {};

  const currentAvatar = createAvatar(
    styleName,
    selectedStyleOptions
  ).toString();

  const configStyleOptions = availableStyles[styleName].options;

  for (const key in configStyleOptions) {
    if (false === configStyleOptions.hasOwnProperty(key)) {
      continue;
    }

    combinations[key] = [];

    const styleOption = configStyleOptions[key];
    const avatarOption = selectedStyleOptions[key];

    for (const value of styleOption.values) {
      const options = {
        ...selectedStyleOptions,
        [key]: value,
      };

      const avatar = createAvatar(styleName, options);
      const active = avatarOption === value;
      const isIdentical = currentAvatar === avatar.toString();

      if (!isIdentical || active) {
        combinations[key].push({
          active: avatarOption === value,
          avatar,
          options,
        });
      }
    }
  }

  return combinations;
}
