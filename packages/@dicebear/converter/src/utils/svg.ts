export function ensureSize(svg: string, defaultSize: number = 512) {
  let size = defaultSize;

  svg = svg.replace(/<svg([^>]*?(?:width="(\d+)"[^>]*)?)>/, (match, g1, g2) => {
    if (g2) {
      size = parseInt(g2);
    } else {
      g1 += ` width="${size}" height="${size}"`;
    }

    return `<svg${g1}>`;
  });

  return { svg, size };
}
