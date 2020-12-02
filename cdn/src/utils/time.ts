export function toSeconds(val: string) {
  let match = val.match(/(\d+)([smhdwMy])/);

  if (match) {
    switch (match[2]) {
      case 's':
        return parseInt(match[1]);

      case 'm':
        return parseInt(match[1]) * 60;

      case 'h':
        return parseInt(match[1]) * 60 * 60;

      case 'd':
        return parseInt(match[1]) * 60 * 60 * 24;

      case 'w':
        return parseInt(match[1]) * 60 * 60 * 24 * 7;

      case 'M':
        return parseInt(match[1]) * 60 * 60 * 24 * 30;

      case 'y':
        return parseInt(match[1]) * 60 * 60 * 24 * 365;
    }
  }

  return 0;
}
