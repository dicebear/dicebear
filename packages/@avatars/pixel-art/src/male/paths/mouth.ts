export default (color: string, mood?: Array<'sad' | 'happy' | 'surprised'>) => {
  let mouth = [];

  while (mouth.length === 0) {
    if ((mood || ['sad']).includes('sad')) {
      mouth.push(
        `<path d="M8 13h3v1H8v-1z" fill="${color}"/>`,
        `<path d="M8 13h4v1H8v-1z" fill="${color}"/>`,
        `<path d="M9 13h2v1H9v-1z" fill="${color}"/>`,
        `<path d="M8 12v1h3v1h1v-1h-1v-1H8z" fill="${color}"/>`,
        `<path d="M8 13v1h1v-1h3v-1H9v1H8z" fill="${color}"/>`
      );
    }

    if ((mood || ['happy']).includes('happy')) {
      mouth.push(
        `<path d="M7 12v1h1v1h4v-1H8v-1H7z" fill="${color}"/>`,
        `<path d="M10 12v1H9v1h2v-2h-1z" fill="${color}"/>`,
        `<path d="M8 13v1h4v-1h1v-1h-1v1H8z" fill="${color}"/>`,
        `<path d="M8 12v2h4v-2H8z" fill="#FFF"/>`
      );
    }

    if ((mood || ['surprised']).includes('surprised')) {
      mouth.push(`<path d="M9 12v2h2v-2H9z" fill="${color}"/>`, `<path d="M9 13v1h1v-1H9z" fill="${color}"/>`);
    }

    if (mouth.length === 0) {
      // Reset mood option because it appears to be invalid.
      mood = undefined;
    }
  }

  return mouth;
};
