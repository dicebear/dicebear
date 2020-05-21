export default (color: string) => [
  `<path d="M4 0v2H2v2h16V2h-2V0H4z" fill="${color}"/>`,
  `<path d="M4 3H2v1h16V3h-2V0H4v3z" fill="${color}"/>`,
  `<path d="M2 2v2h16V2h-1V1h-1V0H4v1H3v1H2z" fill="${color}"/>`,
  `<path d="M6 0v1H5v1H4v2h14V3h-2V2h-1V1h-1V0H6z" fill="${color}"/>`,
  `<path d="M2 4V2h2V0h12v2h2v2H2z" fill="${color}"/><path d="M4 0v2h12V0H4z" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M2 4V3h2V0h12v3h2v1H2z" fill="${color}"/><path d="M4 0v3h12V0H4z" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M2 4V2h1V1h1V0h12v1h1v1h1v2H2z" fill="${color}"/><path d="M3 1v1h14V1H3zM2 3v1h16V3H2z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M14 0H6v1H5v1H4v2h14V3h-2V2h-1V1h-1V0z" fill="${color}"/><path d="M5 3h1V2h1V1h1V0H7v1H6v1H5v1z" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M4 0v2H2v2h16V2h-2V0H4z" fill="${color}"/><path d="M15 3V0h-1v3h1z" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M4 0v3H2v1h16V3h-2V0H4z" fill="${color}"/><path d="M15 3V0h-1v3h1zm-2-3v2h-1V0h1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M2 2v2h16V2h-1V1h-1V0H4v1H3v1H2z" fill="${color}"/><path d="M15 0v4h-1V0h1zm-2 0v4h-1V0h1z" fill-rule="evenodd" fill="#FFF" fill-opacity=".2"/>`,
  `<path d="M5 2H4v2h14V3h-2V2h-1V1h-1V0H6v1H5v1z" fill="${color}"/><path d="M14 2h-3v1h3V2z" fill="#FFF" fill-opacity=".2"/>`,
];
