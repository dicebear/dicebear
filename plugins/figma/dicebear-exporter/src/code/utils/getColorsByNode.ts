import { isSupportedColor } from './isSupportedColor';

export function getColorsByNode(node: SceneNode | PageNode) {
  const colors = new Map<'fill' | 'stroke', PaintStyle>();

  if ('fillStyleId' in node && typeof node.fillStyleId === 'string' && node.fillStyleId) {
    let color = figma.getStyleById(node.fillStyleId) as PaintStyle;

    if (isSupportedColor(color)) {
      colors.set('fill', color);
    }
  }

  if ('strokeStyleId' in node && typeof node.strokeStyleId === 'string' && node.strokeStyleId) {
    let color = figma.getStyleById(node.strokeStyleId) as PaintStyle;

    if (isSupportedColor(color)) {
      colors.set('stroke', color);
    }
  }

  return colors;
}
