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
              >
                <Check :size="18" />
              </span>
              <span
                v-else-if="row.values[service.key] === 'free'"
                class="docs-comparison-cell-free"
              >
                Free
              </span>
              <span
                v-else-if="row.values[service.key] === 'paid'"
                class="docs-comparison-cell-paid"
              >
                Paid
              </span>
              <span
                v-else-if="row.values[service.key] === 'no'"
                class="docs-comparison-cell-no"
              >
                <X :size="18" />
              </span>
              <span v-else class="docs-comparison-cell-text">{{
                row.values[service.key]
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.docs-comparison {
  margin: 24px 0;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--vp-radius-md, 12px);
  overflow: hidden;
}

.docs-comparison-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

// This table renders inside `.vp-doc` content, which ships its own table
// styling (block display, full borders, zebra rows). The extra
// `.docs-comparison` prefix lifts specificity above those rules so the custom
// look survives without `!important`.
.docs-comparison .docs-comparison-table {
  display: table;
  width: 100%;
  min-width: 700px;
  margin: 0;
  border-collapse: collapse;
  font-size: 14px;
}

.docs-comparison .docs-comparison-table th,
.docs-comparison .docs-comparison-table td {
  padding: 12px 16px;
  text-align: center;
  border: none;
  border-bottom: 1px solid var(--vp-c-border);
  white-space: nowrap;
}

.docs-comparison .docs-comparison-table tr {
  background: transparent;
  border-top: none;
}

.docs-comparison .docs-comparison-table thead th {
  font-weight: 700;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.docs-comparison .docs-comparison-table tbody tr:last-child td {
  border-bottom: none;
}

.docs-comparison .docs-comparison-table thead .docs-comparison-highlight-col {
  color: var(--vp-c-brand-1);
}

.docs-comparison .docs-comparison-table .docs-comparison-feature-col {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 160px;
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.docs-comparison .docs-comparison-table .docs-comparison-highlight-col {
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  font-weight: 600;
}

.docs-comparison-service-link {
  color: inherit;
  text-decoration: none;
  transition: color var(--duration-fast) ease;
}

.docs-comparison-service-link::after {
  display: none !important;
}

.docs-comparison-service-link:hover {
  color: var(--vp-c-brand-1);
}

.docs-comparison-cell-yes {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.docs-comparison-cell-free {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--vp-radius-sm);
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
  font-size: 13px;
  font-weight: 600;
}

.docs-comparison-cell-paid {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--vp-radius-sm);
  background: color-mix(in srgb, var(--vp-c-text-3) 10%, transparent);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
}

.docs-comparison-cell-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-text-3) 15%, transparent);
  color: var(--vp-c-text-3);
}

.docs-comparison-cell-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
