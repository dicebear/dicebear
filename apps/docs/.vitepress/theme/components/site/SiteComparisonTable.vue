<script setup lang="ts">
/**
 * DiceBear next to four other avatar libraries, as a table in a card. The
 * DiceBear column is picked out; a yes or a no is a round mark. When the
 * card is too narrow the table scrolls inside it and the feature column
 * stays in place. Used on the Why DiceBear page and in the docs.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { Check, X } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import {
  buildComparisonRows,
  comparisonServices,
} from '@theme/config/comparison';

type CellKind = 'yes' | 'no' | 'free' | 'paid' | 'text';

const { theme } = useData<ThemeOptions>();

/** "Avatar Styles" -> "Avatar styles". Acronyms such as "HTTP API" stay. */
function sentenceCase(label: string): string {
  return label
    .split(' ')
    .map((word, index) =>
      index === 0 || word === word.toUpperCase() ? word : word.toLowerCase(),
    )
    .join(' ');
}

const KINDS = ['yes', 'no', 'free', 'paid'];

const rows = computed(() =>
  buildComparisonRows({
    stars: theme.value.githubStars ?? {},
    styleCount: theme.value.styleCount,
    animatedStyleCount: theme.value.animatedStyleCount,
  }).map((row) => ({
    feature: sentenceCase(row.feature),
    cells: comparisonServices.map((service) => {
      const value = row.values[service.key];
      const kind = (KINDS.includes(value) ? value : 'text') as CellKind;

      return {
        key: service.key,
        kind,
        text: value === '–' ? 'None' : value,
      };
    }),
  })),
);
</script>

<template>
  <div
    class="site-table-card site-comparison"
    tabindex="0"
    role="group"
    aria-label="Comparison table"
  >
    <table class="site-table is-centered">
      <thead>
        <tr>
          <th scope="col" class="site-label">Feature</th>
          <th
            v-for="(service, index) in comparisonServices"
            :key="service.key"
            scope="col"
            :class="{ 'is-pick': index === 0 }"
          >
            <span v-if="index === 0">{{ service.name }}</span>
            <a
              v-else
              :href="service.url"
              target="_blank"
              rel="noopener noreferrer"
              >{{ service.name }}</a
            >
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.feature">
          <th scope="row">{{ row.feature }}</th>
          <td
            v-for="(cell, index) in row.cells"
            :key="cell.key"
            :class="{ 'is-pick': index === 0 }"
          >
            <span
              v-if="cell.kind === 'yes'"
              class="site-mark is-yes"
              role="img"
              aria-label="Yes"
            >
              <Check :size="18" :stroke-width="2.5" aria-hidden="true" />
            </span>
            <span
              v-else-if="cell.kind === 'no'"
              class="site-mark"
              role="img"
              aria-label="No"
            >
              <X :size="18" :stroke-width="2.5" aria-hidden="true" />
            </span>
            <span
              v-else-if="cell.kind === 'free'"
              class="site-tag site-tag-sm site-tag-solid"
              >Free</span
            >
            <span v-else-if="cell.kind === 'paid'" class="site-tag site-tag-sm"
              >Paid</span
            >
            <template v-else>{{ cell.text }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.site-comparison {
  position: relative;
  overscroll-behavior-x: contain;

  table {
    min-width: 880px;
  }

  thead th {
    border-bottom-color: var(--db-line);
  }

  thead a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }
  }

  thead .site-label {
    font-family: var(--db-font);
    font-size: 13px;
    color: var(--db-muted);
  }

  tbody th {
    width: 200px;
    color: var(--db-ink);
  }

  /* The feature column stays in view while the libraries scroll under it.
     The shadow covers the padding of the card to its left. */
  @media (max-width: 1023px) {
    :is(thead, tbody) th:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
      width: 150px;
      background: var(--db-raised);
      box-shadow: -32px 0 0 var(--db-raised);
    }
  }
}
</style>
