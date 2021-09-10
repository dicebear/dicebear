import { getNameParts } from '../utils/getNameParts';
import { isSupportedColor } from '../utils/isSupportedColor';

export function findAllColorGroups() {
  const colorGroups = new Map<string, Map<string, PaintStyle>>();
  const paintStyles = figma.getLocalPaintStyles();

  for (const paintStyle of paintStyles) {
    if (false === isSupportedColor(paintStyle)) {
      continue;
    }

    const { group: colorGroupName, name: colorName } = getNameParts(paintStyle.name);

    if (false === colorGroups.has(colorGroupName)) {
      colorGroups.set(colorGroupName, new Map());
    }

    colorGroups.get(colorGroupName)?.set(colorName, paintStyle);
  }

  return colorGroups;
}
