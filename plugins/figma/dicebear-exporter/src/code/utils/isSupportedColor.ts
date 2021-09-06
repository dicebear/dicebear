import { getNameParts } from './getNameParts';

export function isSupportedColor(color: PaintStyle): boolean {
  const colorGroupName = getNameParts(color.name).group;

  return (
    colorGroupName.length > 0 &&
    false === color.remote &&
    color.paints.length === 1 &&
    color.paints?.[0].type === 'SOLID'
  );
}
