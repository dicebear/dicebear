export default (color: string, alpha: number) => [
  `<path d="M3 10v3h1v1h1v1h10v-1h1v-1h1v-3h-3v1H6v-1H3z" id="Path" fill="${color}" fill-opacity="${alpha}"/>`,
  `<path d="M3 13h1v1h1v1h10v-1h1v-1h1v-3h-1v1h-1v1H5v-1H4v-1H3v3z" id="Path" fill="${color}" fill-opacity="${alpha}"/>`,
  `<path d="M3 11v2h1v1h1v1h10v-1h1v-1h1v-2H3z" id="Path" fill="${color}" fill-opacity="${alpha}"/>`,
  `<path d="M3 7v6h1v1h1v1h10v-1h1v-1h1V7h-1v2h-1v1h-1v1H6v-1H5V9H4V7H3z" id="Path" fill="${color}" fill-opacity="${alpha}"/>`,
];
