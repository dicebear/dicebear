/*!
 * Copyright by chickens / stackoverflow
 * Licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).
 * Source: https://stackoverflow.com/a/63763497
 */
export function getInitials(seed: string): string {
  return seed
    .match(/(^\S\S?|\s\S)?/g)!
    .map((v) => v.trim())
    .join('')
    .match(/(^\S|\S$)?/g)!
    .join('')
    .toLocaleUpperCase();
}
