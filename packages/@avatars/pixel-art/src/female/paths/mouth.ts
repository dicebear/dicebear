export default (color: string, mood?: Array<'sad' | 'happy' | 'surprised'>) => {
  let mouth = [];

  while (mouth.length === 0) {
    if ((mood || ['sad']).includes('sad')) {
      mouth.push(
        `<path d="M9 11v1H8v1h4v-1h-1v-1H9z" fill="${color}"/>`,
        `<path d="M11 11v1H9v1H8v-1h1v-1h2z" fill="${color}"/>`,
        `<path d="M9 12h2v1H9v-1z" fill="${color}"/>`,
        `<path d="M9 12v1h1v1h1v-2H9z" fill="${color}"/>`
      );
    }

    if ((mood || ['happy']).includes('happy')) {
      mouth.push(
        `<path d="M9 11v2h2v-1h-1v-1H9z" fill="${color}"/><path d="M11 13v-1h-1v-1H9v1h1v1h1z" fill="#FFF" fill-opacity=".2"/>`,
        `<path d="M10 11v1H9v1h2v-2h-1z" fill="${color}"/>`,
        `<path d="M8 11v1h1v1h2v-1h1v-1H8z" fill="${color}"/>`,
        `<path d="M9 12v1h2v-1h1v-1h-1v1H9z" fill="${color}"/>`,
        `<path d="M8 11v1h1v1h2v-1H9v-1H8z" fill="${color}"/>`,
        `<path d="M8 12v1h1v1h2v-1h1v-1h-1v-1H9v1H8z" fill="${color}"/><path d="M9 12v1h2v-1H9z" fill="#FFF"/>`,
        `<path d="M8 12v1h1v1h2v-1h1v-1h-1v-1H9v1H8z" fill="${color}"/><path d="M9 12v1h2v-1H9z" fill="#FFF" fill-opacity=".2"/>`
      );
    }

    if ((mood || ['surprised']).includes('surprised')) {
      mouth.push(`<path d="M9 12v1h1v-1H9z" fill="${color}"/>`, `<path d="M9 11v2h2v-2H9z" fill="${color}"/>`);
    }

    if (mouth.length === 0) {
      // Reset mood option because it appears to be invalid.
      mood = undefined;
    }
  }

  return mouth;
};
