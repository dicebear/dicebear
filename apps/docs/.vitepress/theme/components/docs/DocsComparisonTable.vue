<script setup lang="ts">
import { useData } from 'vitepress';
import { Check, X } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import {
  buildComparisonRows,
  comparisonServices,
} from '@theme/config/comparison';

const { theme } = useData<ThemeOptions>();

const rows = buildComparisonRows({
  stars: theme.value.githubStars ?? {},
  styleCount: theme.value.styleCount,
  animatedStyleCount: theme.value.animatedStyleCount,
});
</script>

<template>
  <div class="docs-comparison">
    <div class="docs-comparison-wrapper">
      <table class="docs-comparison-table">
        <thead>
          <tr>
            <th class="docs-comparison-feature-col">Feature</th>
            <th
              v-for="(service, index) in comparisonServices"
              :key="service.key"
              :class="{ 'docs-comparison-highlight-col': index === 0 }"
            >
              <a
                :href="service.url"
                target="_blank"
                rel="noopener"
                class="docs-comparison-service-link"
                >{{ service.name }}</a
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td class="docs-comparison-feature-col">{{ row.feature }}</td>
            <td
              v-for="(service, colIndex) in comparisonServices"
              :key="service.key"
              :class="{ 'docs-comparison-highlight-col': colIndex === 0 }"
            >
              <span
                v-if="row.values[service.key] === 'yes'"
                class="docs-comparison-cell-yes"
                role="img"
                aria-label="Yes"
              >
                <Check :size="18" />
              </span>
              <span
                v-else-if="row.values[service.key] === 'free'"
                class="site-chip site-chip-ok"
              >
                Free
              </span>
              <span
                v-else-if="row.values[service.key] === 'paid'"
                class="site-chip site-chip-muted"
              >
                Paid
              </span>
              <span
                v-else-if="row.values[service.key] === 'no'"
                class="docs-comparison-cell-no"
                role="img"
                aria-label="No"
              >
                <X :size="18" />
              </span>
              <span v-else>{{ row.values[service.key] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.docs-comparison-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.docs-comparison-table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 16px;
    text-align: center;
    white-space: nowrap;
  }

  th {
    padding-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--db-line);
    vertical-align: bottom;
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--db-muted);
  }

  td {
    border-top: 1px solid var(--db-line);
    vertical-align: middle;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  tbody tr:first-child td {
    border-top: 0;
  }

  th:last-child,
  td:last-child {
    padding-right: 0;
  }

  /* The feature column stays in view while the services scroll under it,
     which is why it carries the page color. */
  .docs-comparison-feature-col {
    position: sticky;
    left: 0;
    z-index: 1;
    min-width: 160px;
    padding-left: 0;
    background: var(--db-paper);
    text-align: left;
  }

  td.docs-comparison-feature-col {
    font-weight: 600;
    color: var(--db-ink);
  }

  th.docs-comparison-highlight-col {
    color: var(--db-ink);
  }

  td.docs-comparison-highlight-col {
    font-weight: 600;
    color: var(--db-ink);
  }
}

.docs-comparison-service-link {
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--db-brand-text);
  }
}

.docs-comparison-cell-yes,
.docs-comparison-cell-no {
  display: inline-flex;
  vertical-align: middle;
}

.docs-comparison-cell-yes {
  color: var(--db-ok);
}

.docs-comparison-cell-no {
  color: var(--db-muted);
}
</style>
