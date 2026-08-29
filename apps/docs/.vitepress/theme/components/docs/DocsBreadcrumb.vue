<script setup lang="ts">
/**
 * The trail above a page title, e.g. Styles / Lorelei / Presets.
 *
 * The hierarchy comes from the sidebar, not from the URL, because the two
 * disagree: `/understand/dicebear-vs-alternatives/` sits under the "Introduction"
 * group, and `/start/what-is-dicebear/` is a leaf inside it rather than a section of its
 * own. Reading the path would put both pages in the wrong place.
 *
 * Labels come from the sidebar for the same reason a frontmatter title cannot
 * be used: that title is written for search results ("Access All Available
 * Style Options Programmatically") and is far too long for a trail.
 *
 * Pages the sidebar does not list, such as the generated preset galleries under
 * `/styles/<name>/presets/`, take the trail of their nearest listed ancestor
 * and append their remaining path segments in title case.
 *
 * Renders nothing when that leaves a single crumb, so pages without a parent
 * keep their current header.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { ChevronRight } from '@lucide/vue';
import { capitalCase } from 'change-case';
import type { DefaultTheme } from 'vitepress';
import type { ThemeOptions } from '@theme/types';

const { page, theme } = useData<ThemeOptions>();

/**
 * Sidebar groups are headings without a link of their own. This one also has a
 * page, so the trail links it; every other group stays plain text.
 */
const GROUP_LINKS: Record<string, string> = {
  Styles: '/styles/',
};

type Crumb = { label: string; href?: string };

/**
 * Sidebar entries carry a "New" badge as inline markup. The trail wants the
 * label alone, so the badge goes with its text and not just its tags.
 */
function plain(text: string): string {
  return text
    .replace(/<span[^>]*vp-sidebar-badge[^>]*>.*?<\/span>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/** `styles/lorelei` and `/styles/lorelei` both become `/styles/lorelei/`. */
function normalize(path: string): string {
  return `/${path.replace(/^\/|\/$/g, '')}/`.replace('//', '/');
}

/** Every sidebar link mapped to its ancestor chain, outermost group first. */
const sidebarTrails = computed(() => {
  const result = new Map<string, Crumb[]>();
  const sidebar = theme.value.sidebar as DefaultTheme.Sidebar | undefined;

  if (!sidebar) {
    return result;
  }

  const walk = (items: DefaultTheme.SidebarItem[], trail: Crumb[]) => {
    for (const item of items) {
      const label = plain(item.text ?? '');
      const href = item.link ?? GROUP_LINKS[label];
      const here = label ? [...trail, { label, href }] : trail;

      if (item.link) {
        result.set(normalize(item.link), here);
      }

      if (item.items) {
        walk(item.items as DefaultTheme.SidebarItem[], here);
      }
    }
  };

  // The sidebar is keyed by path prefix, and four of those prefixes point at
  // the same array, so the Set keeps the docs tree from being walked four
  // times over.
  const groups = Array.isArray(sidebar)
    ? [sidebar]
    : new Set(Object.values(sidebar).filter(Array.isArray));

  for (const group of groups) {
    walk(group as DefaultTheme.SidebarItem[], []);
  }

  return result;
});

const crumbs = computed<Crumb[]>(() => {
  const segments = page.value.relativePath
    .replace(/(^|\/)index\.md$/, '')
    .replace(/\.md$/, '')
    .split('/')
    .filter(Boolean);

  const here = normalize(segments.join('/'));

  // Walk up until the sidebar knows the path, then append what was dropped.
  for (let depth = segments.length; depth > 0; depth--) {
    const trail = sidebarTrails.value.get(
      normalize(segments.slice(0, depth).join('/')),
    );

    if (!trail) {
      continue;
    }

    const rest: Crumb[] = segments.slice(depth).map((segment) => ({
      label: capitalCase(segment),
    }));

    // Never link to where the reader already is. That covers the page itself
    // and the sidebar groups that repeat their first child's link, such as
    // "JS Library" above "Core".
    return [...trail, ...rest].map((crumb) =>
      crumb.href && normalize(crumb.href) === here
        ? { label: crumb.label }
        : crumb,
    );
  }

  return segments.map((segment) => ({ label: capitalCase(segment) }));
});
</script>

<template>
  <nav v-if="crumbs.length > 1" class="docs-breadcrumb" aria-label="Breadcrumb">
    <ol class="docs-breadcrumb-list">
      <!-- Keyed by position, because a label can repeat within one trail: a
           sidebar group that carries a page of its own sits above a leaf with
           the same name. -->
      <li v-for="(crumb, index) in crumbs" :key="index">
        <ChevronRight
          v-if="index > 0"
          :size="13"
          class="docs-breadcrumb-sep"
          aria-hidden="true"
        />
        <a
          v-if="crumb.href"
          :href="withBase(crumb.href)"
          class="docs-breadcrumb-link"
          >{{ crumb.label }}</a
        >
        <!-- Only the last crumb is the page the reader is on. The plain crumbs
             before it are sidebar groups and repeated parent links, and marking
             those as current too would have a screen reader announce three
             current pages in one trail. -->
        <span
          v-else
          :aria-current="index === crumbs.length - 1 ? 'page' : undefined"
          >{{ crumb.label }}</span
        >
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
.docs-breadcrumb {
  min-width: 0;
  font-size: 13px;
  line-height: 1.4;
  color: var(--ui-c-text-muted);
}

.docs-breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 4px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.docs-breadcrumb-sep {
  flex: none;
  color: var(--ui-c-text-subtle);
}

.docs-breadcrumb-link {
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--vp-c-brand-1);
    text-decoration: underline;
  }
}
</style>
