<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { capitalCase } from 'change-case';
import Checkbox from 'primevue/checkbox';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { Search, X } from '@lucide/vue';
import {
  UiAvatar,
  UiCard,
  UiContainer,
  UiHeadline,
  UiDescription,
} from '@theme/components/ui';
import { useVisibility } from '@theme/composables/useVisibility';
import type { ThemeOptions } from '@theme/types';

const { theme } = useData<ThemeOptions>();

const sizes = theme.value.avatarStyleSizes;
const styleNames = Object.keys(theme.value.avatarStyles).sort();

const selected = ref<Set<string>>(new Set());
const includeConverter = ref(false);
const filter = ref('');
const summarySentinel = ref<HTMLElement | null>(null);

// Sentinel sits at the summary's natural position; when it scrolls past the
// sticky top edge the summary is "stuck" and we show its drop shadow.
const sentinelVisible = useVisibility(summarySentinel, {
  threshold: 0,
  rootMargin: '-80px 0px 0px 0px',
  once: false,
});
const isSummaryStuck = computed(() => !sentinelVisible.value);

const visibleStyles = computed(() => {
  const q = filter.value.toLowerCase().trim();
  if (!q) return styleNames;
  return styleNames.filter((name) => {
    return (
      name.toLowerCase().includes(q) ||
      styleTitle(name).toLowerCase().includes(q)
    );
  });
});

const selectedGzip = computed(() => {
  let total = 0;
  for (const name of selected.value) {
    total += sizes.styles[name]?.gzip ?? 0;
  }
  return total;
});

const grandTotalGzip = computed(
  () =>
    sizes.core.gzip +
    (includeConverter.value ? sizes.converter.gzip : 0) +
    selectedGzip.value,
);

function toggle(name: string) {
  const next = new Set(selected.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  selected.value = next;
}

function selectAll() {
  selected.value = new Set(styleNames);
}

function clear() {
  selected.value = new Set();
}

function formatSize(bytes: number): string {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} kB`;
  return `${bytes} B`;
}

function styleTitle(name: string): string {
  return capitalCase(name);
}
</script>

<template>
  <UiContainer size="sm" class="bundle-size-tool">
    <header class="bundle-size-tool-hero">
      <UiHeadline tag="h1"> <strong>Bundle Size</strong> Estimator </UiHeadline>
      <UiDescription>
        Pick the styles you plan to use and see how many minified, gzipped
        kilobytes they'll add to your JavaScript bundle.
      </UiDescription>
    </header>

    <div
      ref="summarySentinel"
      class="bundle-size-summary-sentinel"
      aria-hidden="true"
    />
    <UiCard
      padding="lg"
      class="bundle-size-summary"
      :class="{ 'is-stuck': isSummaryStuck }"
    >
      <div
        class="bundle-size-summary-row bundle-size-summary-row-toggle is-disabled"
      >
        <label class="bundle-size-summary-row-label">
          <Checkbox :model-value="true" :binary="true" :disabled="true" />
          <span class="bundle-size-summary-label">
            <code>@dicebear/core</code>
            <span class="bundle-size-summary-hint">always required</span>
          </span>
          <span class="bundle-size-summary-values">
            <span class="bundle-size-summary-raw">{{
              formatSize(sizes.core.gzip)
            }}</span>
            <span class="bundle-size-summary-gzip">gzip</span>
          </span>
        </label>
      </div>
      <div class="bundle-size-summary-row bundle-size-summary-row-toggle">
        <label class="bundle-size-summary-row-label">
          <Checkbox v-model="includeConverter" :binary="true" />
          <span class="bundle-size-summary-label">
            <code>@dicebear/converter</code>
            <span class="bundle-size-summary-hint"
              >PNG, JPEG, WebP & AVIF output</span
            >
          </span>
          <span class="bundle-size-summary-values">
            <span class="bundle-size-summary-raw">{{
              formatSize(sizes.converter.gzip)
            }}</span>
            <span class="bundle-size-summary-gzip">gzip</span>
          </span>
        </label>
      </div>
      <div class="bundle-size-summary-row">
        <div class="bundle-size-summary-row-label">
          <span class="bundle-size-summary-label">
            {{ selected.size }} style{{ selected.size === 1 ? '' : 's' }}
            selected
          </span>
          <span class="bundle-size-summary-values">
            <span class="bundle-size-summary-raw">{{
              formatSize(selectedGzip)
            }}</span>
            <span class="bundle-size-summary-gzip">gzip</span>
          </span>
        </div>
      </div>
      <div class="bundle-size-summary-row bundle-size-summary-row-total">
        <div class="bundle-size-summary-row-label">
          <span class="bundle-size-summary-label">Total</span>
          <span class="bundle-size-summary-values">
            <span class="bundle-size-summary-raw">{{
              formatSize(grandTotalGzip)
            }}</span>
            <span class="bundle-size-summary-gzip">gzip</span>
          </span>
        </div>
      </div>
    </UiCard>

    <UiCard padding="lg" class="bundle-size-picker">
      <div class="bundle-size-picker-toolbar">
        <IconField class="bundle-size-picker-search">
          <InputIcon>
            <Search :size="16" />
          </InputIcon>
          <InputText
            v-model="filter"
            placeholder="Filter styles…"
            spellcheck="false"
            fluid
          />
        </IconField>
        <div class="bundle-size-picker-actions">
          <Button
            label="Select all"
            severity="secondary"
            variant="outlined"
            @click="selectAll"
          />
          <Button
            label="Clear"
            severity="secondary"
            variant="outlined"
            @click="clear"
          >
            <template #icon><X :size="14" /></template>
          </Button>
        </div>
      </div>

      <ul class="bundle-size-list">
        <li
          v-for="name in visibleStyles"
          :key="name"
          class="bundle-size-row"
          :class="{ 'bundle-size-row-selected': selected.has(name) }"
        >
          <label class="bundle-size-row-label">
            <Checkbox
              :model-value="selected.has(name)"
              :binary="true"
              @update:model-value="toggle(name)"
            />
            <UiAvatar
              :style-name="name"
              :style-options="{ seed: name, size: 28 }"
              :size="28"
              alt=""
              mode="library"
              class="bundle-size-row-avatar"
            />
            <span class="bundle-size-row-title">{{ styleTitle(name) }}</span>
            <code class="bundle-size-row-slug">{{ name }}</code>
            <span class="bundle-size-row-values">
              <span class="bundle-size-row-raw">{{
                formatSize(sizes.styles[name]?.gzip ?? 0)
              }}</span>
              <span class="bundle-size-row-gzip">gzip</span>
            </span>
          </label>
        </li>
        <li v-if="visibleStyles.length === 0" class="bundle-size-empty">
          No styles match "{{ filter }}".
        </li>
      </ul>
    </UiCard>
  </UiContainer>
</template>

<style lang="scss">
html.dark {
  .bundle-size-summary,
  .bundle-size-picker {
    background: var(--vp-c-bg-soft);
  }

  .bundle-size-row:hover,
  .bundle-size-summary-row-toggle:not(.is-disabled):hover {
    background: var(--vp-c-bg);
  }

  .bundle-size-row-slug {
    background: var(--vp-c-bg);
  }

  .bundle-size-summary.is-stuck {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }
}

/* @dicebear/core is always required, so its checkbox is `disabled`. Restore
 * the checked brand color so it still reads as an active state instead of a
 * muted disabled control. */
.bundle-size-summary-row-toggle.is-disabled
  .p-checkbox-checked
  .p-checkbox-box {
  background: var(--p-checkbox-checked-background);
  border-color: var(--p-checkbox-checked-border-color);
  color: var(--p-checkbox-icon-checked-color);
}
</style>

<style lang="scss" scoped>
.bundle-size-tool {
  padding-top: 80px;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  &-hero {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 8px;

    code {
      background: var(--vp-c-bg-soft);
      padding: 2px 6px;
      border-radius: var(--vp-radius-xs);
      font-size: 0.9em;
    }
  }

  @media (max-width: 640px) {
    padding-top: 32px;
  }
}

.bundle-size-summary-sentinel {
  height: 1px;
  margin-bottom: -1px;
}

.bundle-size-summary {
  position: sticky;
  top: calc(var(--vp-nav-height, 64px) + 16px);
  z-index: 10;
  box-shadow: none;
  transition: box-shadow var(--duration-fast) var(--ease-smooth);

  :deep(.ui-card-body) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &.is-stuck {
    box-shadow: var(--vp-shadow-2);
  }

  // Row container mirrors `.bundle-size-row` from the picker below.
  &-row {
    border-radius: var(--vp-radius-xs);
    transition: background-color var(--duration-fast) var(--ease-smooth);

    &-toggle:not(.is-disabled):hover {
      background: var(--vp-c-bg-soft);
    }

    &-total {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--vp-c-divider);
      border-radius: 0;
    }
  }

  // Inner label mirrors `.bundle-size-row-label` from the picker.
  &-row-label {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    min-width: 0;
  }

  &-row-toggle &-row-label {
    cursor: pointer;
  }

  &-row-toggle.is-disabled &-row-label {
    cursor: not-allowed;
  }

  // Info rows (no checkbox) get extra left padding so their label aligns
  // with the package name in the toggle rows above (checkbox width + gap).
  &-row:not(&-row-toggle) &-row-label {
    padding-left: 40px;
  }

  &-label {
    font-size: 13px;
    color: var(--ui-c-text-muted);
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex: 1;
    min-width: 0;

    code {
      font-family: var(--vp-font-family-mono);
      font-size: 13px;
      color: var(--vp-c-text-1);
      background: var(--vp-c-bg-soft);
      padding: 2px 6px;
      border-radius: var(--vp-radius-xs);
    }
  }

  &-hint {
    font-size: 12px;
    color: var(--ui-c-text-subtle);
  }

  &-row-total &-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-values {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    margin-left: auto;
  }

  &-raw {
    font-size: 18px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  &-row-total &-raw {
    font-size: 22px;
  }

  &-gzip {
    font-size: 12px;
    color: var(--ui-c-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.bundle-size-picker {
  :deep(.ui-card-body) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &-search {
    flex: 1;
    min-width: 200px;
  }

  &-actions {
    display: flex;
    gap: 8px;
  }
}

.bundle-size-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bundle-size-row {
  border-radius: var(--vp-radius-xs);
  transition: background-color var(--duration-fast) var(--ease-smooth);

  &:hover {
    background: var(--vp-c-bg-soft);
  }

  &-selected {
    background: var(--vp-c-brand-soft);

    &:hover {
      background: var(--vp-c-brand-soft);
    }
  }

  &-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
    padding: 10px 12px;
    min-width: 0;
  }

  &-avatar {
    flex-shrink: 0;
  }

  &-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
  }

  &-slug {
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    color: var(--ui-c-text-subtle);
    background: var(--vp-c-bg-soft);
    padding: 2px 6px;
    border-radius: var(--vp-radius-xs);
  }

  &-values {
    display: flex;
    align-items: baseline;
    gap: 12px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    margin-left: auto;
  }

  &-raw {
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-gzip {
    font-size: 11px;
    color: var(--ui-c-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
}

.bundle-size-empty {
  text-align: center;
  padding: 24px;
  color: var(--ui-c-text-subtle);
  font-size: 13px;
}

@media (max-width: 640px) {
  // On small screens the sticky summary card eats too much of the viewport;
  // drop the sticky behavior so it scrolls away with the rest of the content.
  .bundle-size-summary {
    position: static;
    box-shadow: none !important;
  }

  // Tighter row padding + smaller "raw" value so summary rows fit on narrow
  // viewports without the value crashing into the label. Allow wrapping so
  // the values drop to a second line if the label needs the full width.
  .bundle-size-summary-row-label {
    flex-wrap: wrap;
    padding: 8px 10px;
    gap: 6px 10px;
  }

  // Force the values onto a second row so the code/label can use the full
  // width above without being clipped by the value column. Left-align so
  // the size reads directly under the package name.
  .bundle-size-summary-values {
    flex-basis: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }

  // Toggle rows have a checkbox before the label; indent the values to sit
  // under the package name instead of the checkbox.
  .bundle-size-summary-row-toggle .bundle-size-summary-values {
    margin-left: 30px;
  }

  .bundle-size-summary-raw {
    font-size: 15px;
  }

  .bundle-size-summary-row-total .bundle-size-summary-raw {
    font-size: 18px;
  }

  // Allow the label/hint to wrap to a second line on tiny viewports if needed.
  .bundle-size-summary-label {
    flex-wrap: wrap;
    gap: 2px 10px;
  }

  // Hide the secondary "always required" / "PNG, JPEG, …" hint to save
  // vertical space; the package name + size carry the meaning.
  .bundle-size-summary-hint {
    display: none;
  }
}

@media (max-width: 640px) {
  // Mirror the summary row layout: name on top, size on a second line,
  // left-aligned under the title so it reads as a labeled column.
  .bundle-size-row-label {
    flex-wrap: wrap;
    gap: 6px 12px;
  }

  .bundle-size-row-slug {
    display: none;
  }

  .bundle-size-row-values {
    flex-basis: 100%;
    margin-left: 72px; // checkbox (20) + gap (12) + avatar (28) + gap (12)
    justify-content: flex-start;
  }
}
</style>
