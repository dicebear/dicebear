import neutralGlasses from '../../neutral/paths/glasses';

export default (color: string) => [
  `<path d="M3 8V7h1V6h2v1h1V6h2v1h2V6h2v1h1V6h2v1h1v1h-1v1h-1v1h-1v1h-1v-1h-1V9h-1V8H9v1H8v1H7v1H6v-1H5V9H4V8H3z" fill="${color}"/><path d="M3 7v1h1V7h1V6H4v1H3zm5-1v1h1v1h2V7h1V6h-1v1H9V6H8zm7 0v1h1v1h1V7h-1V6h-1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
  ...neutralGlasses(color),
];
