import type { SelectedStyleOptions } from "@/types";
import type { StyleOptions } from "@dicebear/core";
import styleCollection from "@/config/styles";

export default function getAvatarOptions(
  styleName: string,
  options: SelectedStyleOptions
): Record<string, unknown> {
  const result: StyleOptions<any> = {
    size: 512,
  };

  const configStyleOptions = styleCollection[styleName].options;

  for (const key in options) {
    if (false === options.hasOwnProperty(key)) {
      continue;
    }

    const avatarOption = options[key];
    const styleOption = configStyleOptions[key];

    if (styleOption.isArray) {
      result[key] = avatarOption ? [avatarOption] : [];
    } else {
      result[key] = avatarOption;
    }

    if (styleOption.hasProbability) {
      result[`${key}Probability`] = avatarOption ? 100 : 0;
    }
  }

  return result;
}
