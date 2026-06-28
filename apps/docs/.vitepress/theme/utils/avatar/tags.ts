import { capitalCase } from 'change-case';

/**
 * A single parsed tag of the `category:value` grammar used by the core's
 * `tags` variant filter (e.g. `hairStyle:braids`). Tokens without a colon are
 * treated as a bare category and carry an empty `value`.
 */
export type ParsedTag = {
  token: string;
  category: string;
  value: string;
  /** Display label for the value, computed once (e.g. `braids` -> `Braids`). */
  label: string;
};

export type TagCategory = {
  category: string;
  label: string;
  tags: ParsedTag[];
};

export function parseTag(token: string): ParsedTag {
  const sep = token.indexOf(':');
  const category = sep === -1 ? token : token.slice(0, sep);
  const value = sep === -1 ? '' : token.slice(sep + 1);

  return { token, category, value, label: capitalCase(value) };
}

/**
 * Groups a flat tag list into its categories, sorted by category label and by
 * value within each category. Bare-category tags (no `value`) are dropped, as
 * they impose no constraint in the filter.
 */
export function groupTagsByCategory(tags: string[]): TagCategory[] {
  const byCategory = new Map<string, ParsedTag[]>();

  for (const token of tags) {
    const parsed = parseTag(token);

    if (parsed.value === '') {
      continue;
    }

    const group = byCategory.get(parsed.category) ?? [];

    group.push(parsed);
    byCategory.set(parsed.category, group);
  }

  return Array.from(byCategory, ([category, group]) => ({
    category,
    label: capitalCase(category),
    tags: group.sort((a, b) => a.value.localeCompare(b.value)),
  })).sort((a, b) => a.label.localeCompare(b.label));
}
