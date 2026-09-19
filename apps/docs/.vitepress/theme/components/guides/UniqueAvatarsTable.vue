<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { capitalCase } from 'change-case';
import { ThemeOptions } from '@theme/types';

const { theme } = useData<ThemeOptions>();

type SortColumn = 'title' | 'value';
type SortDirection = 'asc' | 'desc';

const sortColumn = ref<SortColumn>('title');
const sortDirection = ref<SortDirection>('asc');

const rows = computed(() => {
  const entries = Object.entries(theme.value.avatarUniqueCounts).map(
    ([key, entry]) => ({
      key,
      title: capitalCase(key),
      display: entry.display,
      log10: entry.log10,
    }),
  );

  const direction = sortDirection.value === 'asc' ? 1 : -1;

  return entries.toSorted((a, b) => {
    if (sortColumn.value === 'value') {
      return (a.log10 - b.log10) * direction;
    }

    return a.title.localeCompare(b.title) * direction;
  });
});

function toggleSort(column: SortColumn): void {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';

    return;
  }

  sortColumn.value = column;
  sortDirection.value = 'asc';
}

function sortIndicator(column: SortColumn): string {
  if (sortColumn.value !== column) {
    return '';
  }

  return sortDirection.value === 'asc' ? ' ↑' : ' ↓';
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th
          :aria-sort="
            sortColumn === 'title'
              ? sortDirection === 'asc'
                ? 'ascending'
                : 'descending'
              : 'none'
          "
          class="sortable"
          @click="toggleSort('title')"
        >
          Style{{ sortIndicator('title') }}
        </th>
        <th
          :aria-sort="
            sortColumn === 'value'
              ? sortDirection === 'asc'
                ? 'ascending'
                : 'descending'
              : 'none'
          "
          class="sortable numeric"
          @click="toggleSort('value')"
        >
          Distinct Avatars{{ sortIndicator('value') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.key">
        <td>{{ row.title }}</td>
        <td class="numeric">{{ row.display }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 0 16px 10px 0;
  border-bottom: 1px solid var(--db-line);
  text-align: left;
  vertical-align: bottom;
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  color: var(--db-muted);
}

td {
  padding: 12px 16px 12px 0;
  border-top: 1px solid var(--db-line);
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

.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.12s;

  &:hover,
  &[aria-sort='ascending'],
  &[aria-sort='descending'] {
    color: var(--db-ink);
  }
}
</style>
