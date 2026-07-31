<script setup lang="ts">
import { ref } from 'vue';
import { Check, X } from '@lucide/vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { UiContainer, UiSection, UiSectionHeader, UiCard } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import {
  buildComparisonRows,
  comparisonServices,
} from '@theme/config/comparison';

const { theme } = useData<ThemeOptions>();
const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const rows = buildComparisonRows({
  stars: theme.value.githubStars ?? {},
  styleCount: theme.value.styleCount,
});
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-comparison-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-comparison-header"
        description="Every tool has its strengths. Choose what works best for your project."
      >
        <template #headline>How DiceBear <strong>Compares</strong></template>
      </UiSectionHeader>

      <UiCard flush class="app-comparison-table-card">
        <div class="app-comparison-table-wrapper">
          <table class="app-comparison-table">
            <thead>
              <tr>
                <th class="app-comparison-feature-col">Feature</th>
                <th
                  v-for="(service, index) in comparisonServices"
                  :key="service.key"
                  :class="{ 'app-comparison-highlight-col': index === 0 }"
                >
                  <a
                    :href="service.url"
                    target="_blank"
                    rel="noopener"
                    class="app-comparison-service-link"
                    >{{ service.name }}</a
                  >
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                <td class="app-comparison-feature-col">{{ row.feature }}</td>
                <td
                  v-for="(service, colIndex) in comparisonServices"
                  :key="service.key"
                  :class="{ 'app-comparison-highlight-col': colIndex === 0 }"
                >
                  <span
                    v-if="row.values[service.key] === 'yes'"
                    class="app-comparison-cell-yes"
                  >
                    <Check :size="18" />
                  </span>
                  <span
                    v-else-if="row.values[service.key] === 'free'"
                    class="app-comparison-cell-free"
                  >
                    Free
                  </span>
                  <span
                    v-else-if="row.values[service.key] === 'paid'"
                    class="app-comparison-cell-paid"
                  >
                    Paid
                  </span>
                  <span
                    v-else-if="row.values[service.key] === 'no'"
                    class="app-comparison-cell-no"
                  >
                    <X :size="18" />
                  </span>
                  <span v-else class="app-comparison-cell-text">{{
                    row.values[service.key]
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCard>

      <p class="app-comparison-note">
        This comparison is based on publicly available information and may not
        reflect the latest updates. Each tool has its own strengths, so choose
        what works best for your project.
      </p>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-comparison {
  &-gradient {
    background:
      radial-gradient(
        ellipse 50% 50% at 50% 0%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 50% 50% at 50% 100%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      );
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-table-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth) 0.2s;

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  &-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    min-width: 700px;

    th,
    td {
      padding: 14px 16px;
      text-align: center;
      border-bottom: 1px solid var(--vp-c-border);
      white-space: nowrap;
    }

    thead th {
      font-weight: 700;
      font-size: 13px;
      color: var(--vp-c-text-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding-bottom: 16px;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    thead .app-comparison-highlight-col {
      color: var(--vp-c-brand-1);
    }
  }

  &-feature-col {
    text-align: left !important;
    font-weight: 600;
    color: var(--vp-c-text-1);
    min-width: 160px;
    position: sticky;
    left: 0;
    z-index: 1;
    background: var(--vp-c-bg);
  }

  &-highlight-col {
    background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
    font-weight: 600;
  }

  &-service-link {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-fast) ease;

    &::after {
      display: none !important;
    }

    &:hover {
      color: var(--vp-c-brand-1);
    }
  }

  &-cell-yes {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--vp-c-green-soft);
    color: var(--vp-c-green-1);
  }

  &-cell-free {
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

  &-cell-paid {
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

  &-cell-no {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--vp-c-text-3) 15%, transparent);
    color: var(--vp-c-text-3);
  }

  &-cell-text {
    font-size: 13px;
    color: var(--vp-c-text-2);
  }

  &-note {
    text-align: center;
    font-size: 13px;
    color: var(--vp-c-text-3);
    margin: 24px auto 0;
    max-width: 600px;
    line-height: 1.6;
  }
}

@media (max-width: 640px) {
  .app-comparison {
    &-table-card {
      --card-padding: 16px;
    }
  }
}
</style>
