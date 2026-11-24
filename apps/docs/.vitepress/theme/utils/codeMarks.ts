/**
 * Marks inside a code sample. Text between the two characters is what the
 * reader typed, such as the seed of the home page demo; a code card shows it
 * highlighted and copies it without the marks.
 */

/** Private-use characters, which no seed typed by hand contains. */
export const MARK_OPEN = '';
export const MARK_CLOSE = '';

export function marked(text: string): string {
  return `${MARK_OPEN}${text}${MARK_CLOSE}`;
}

/** The code the way it goes onto the clipboard. */
export function stripMarks(code: string): string {
  return code.replaceAll(MARK_OPEN, '').replaceAll(MARK_CLOSE, '');
}

/** Turns the marks of highlighted (already escaped) HTML into `<mark>`. */
export function marksToHtml(html: string): string {
  return html
    .replaceAll(MARK_OPEN, '<mark class="code-mark">')
    .replaceAll(MARK_CLOSE, '</mark>');
}
