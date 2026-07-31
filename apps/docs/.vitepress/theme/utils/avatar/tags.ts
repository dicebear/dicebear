import { capitalCase } from 'change-case';

/**
 * A single parsed tag of the `category:value` grammar used by the core's
 * `tags` variant filter (e.g. `hairLength:long`). Tokens without a colon are
 * treated as a bare category and carry an empty `value`.
 */
export type ParsedTag = {
  token: string;
  category: string;
  value: string;
  /** Display label for the value, computed once (e.g. `long` -> `Long`). */
  label: string;
};

export type TagCategory = {
  category: string;
  label: string;
  /** Value tags only, without the bare category token. */
  tags: ParsedTag[];
  /** Every vocabulary token of the category, the bare one (if any) first. */
  tokens: string[];
};

export function parseTag(token: string): ParsedTag {
  const sep = token.indexOf(':');
  const category = sep === -1 ? token : token.slice(0, sep);
  const value = sep === -1 ? '' : token.slice(sep + 1);

  return { token, category, value, label: capitalCase(value) };
}

/**
 * Normalizes a raw `tags` option to a token list. The option accepts a single
 * string as well as a list (schema `anyOf: [tagFilter, array]`), and the core
 * treats `'mood:positive'` and `['mood:positive']` alike — so must every reader
 * here, or a string-valued filter shows up as "no filter" in the UI while the
 * rendered avatar is filtered, and the first click overwrites it.
 */
export function toTagTokens(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  return Array.isArray(value)
    ? value.filter((token): token is string => typeof token === 'string')
    : [];
}

/**
 * Returns the category a filter token addresses, ignoring a leading `!`
 * (disallow) marker. The single place the polarity grammar is decoded.
 */
export function tokenCategory(token: string): string {
  return parseTag(token.startsWith('!') ? token.slice(1) : token).category;
}

/**
 * Groups a flat tag list into its categories, sorted by category label and by
 * value within each category. A bare-category tag (no `value`) registers its
 * category without contributing a value tag, so a category tagged only bare
 * (e.g. the opt-in `animation`) still shows up, just with an empty value
 * list. Every token, bare included, lands in the group's `tokens`.
 */
export function groupTagsByCategory(tags: string[]): TagCategory[] {
  const byCategory = new Map<string, { bare: boolean; tags: ParsedTag[] }>();

  for (const token of tags) {
    const parsed = parseTag(token);
    const group = byCategory.get(parsed.category) ?? { bare: false, tags: [] };

    if (parsed.value === '') {
      group.bare = true;
    } else {
      group.tags.push(parsed);
    }

    byCategory.set(parsed.category, group);
  }

  return Array.from(byCategory, ([category, group]) => {
    const sorted = group.tags.sort((a, b) => a.value.localeCompare(b.value));

    return {
      category,
      label: capitalCase(category),
      tags: sorted,
      tokens: [
        ...(group.bare ? [category] : []),
        ...sorted.map((tag) => tag.token),
      ],
    };
  }).sort((a, b) => a.label.localeCompare(b.label));
}
