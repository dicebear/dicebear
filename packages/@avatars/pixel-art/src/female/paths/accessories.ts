export default (color: string) => [
  `<path d="M2 9v1h1V9H2zm15 0v1h1V9h-1z" fill-rule="evenodd" fill="${color}"/>`,
  `<path d="M2 9v2h1V9H2zm15 0h1v2h-1V9z" fill-rule="evenodd" fill="${color}"/>`,
  `<path d="M2 9v2h1V9H2zm15 0h1v2h-1V9z" fill="${color}"/><path d="M2 9v1h1V9H2zm15 0h1v1h-1V9z" fill="#FFF" fill-opacity=".4"/>`,
  `<path d="M1 9v3h3V9H1zm1 1v1h1v-1H2zm14-1v3h3V9h-3zm1 1v1h1v-1h-1z" fill-rule="evenodd" fill="${color}"/>`,
];
