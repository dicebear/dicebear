<script setup lang="ts">
/**
 * DiceBear next to four other avatar libraries, as a hairline table. The
 * DiceBear column is tinted. Below 960px the table scrolls inside its own
 * frame and the feature column stays in place.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { Check, Minus } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import {
  buildComparisonRows,
  comparisonServices,
} from '@theme/config/comparison';
import AboutSection from './AboutSection.vue';

interface CompareCell {
  key: string;
  ours: boolean;
  state: 'yes' | 'no' | 'text';
  text: string;
}

const { theme } = useData<ThemeOptions>();

const TEXT: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  free: 'Free',
  paid: 'Paid',
  '\u2013': 'None',
};

/** "Avatar Styles" -> "Avatar styles". Acronyms such as "HTTP API" stay. */
function sentenceCase(label: string): string {
  return label
    .split(' ')
    .map((word, index) =>
      index === 0 || word === word.toUpperCase() ? word : word.toLowerCase(),
    )
    .join(' ');
}

const rows = computed(() =>
  buildComparisonRows({
    stars: theme.value.githubStars ?? {},
    styleCount: theme.value.styleCount,
    animatedStyleCount: theme.value.animatedStyleCount,
  }).map((row) => ({
    feature: sentenceCase(row.feature),
    cells: comparisonServices.map((service, index): CompareCell => {
      const value = row.values[service.key];
      return {
        key: service.key,
        ours: index === 0,
        state: value === 'yes' || value === 'no' ? value : 'text',
        text: TEXT[value] ?? value,
      };
    }),
  })),
);
</script>

<template>
  <AboutSection
    :title="['How DiceBear compares']"
    lead="Every tool has its strengths. Choose what works best for your project."
  >
    <div
      class="about-compare-scroll"
      tabindex="0"
      role="group"
      aria-label="Comparison table"
    >
      <table class="about-compare">
        <thead>
          <tr>
            <th scope="col" class="about-compare-feature site-label">
              Feature
            </th>
            <th
              v-for="(service, index) in comparisonServices"
              :key="service.key"
              scope="col"
              :class="['about-compare-service', { 'is-ours': index === 0 }]"
            >
              <span v-if="index === 0">{{ service.name }}</span>
              <a
                v-else
                class="hv-link"
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
            <th scope="row" class="about-compare-feature">{{ row.feature }}</th>
            <td
              v-for="cell in row.cells"
              :key="cell.key"
              :class="{ 'is-ours': cell.ours }"
            >
              <template v-if="cell.state === 'text'">{{ cell.text }}</template>
              <template v-else>
                <Check
                  v-if="cell.state === 'yes'"
                  class="about-compare-yes"
                  :size="20"
                  aria-hidden="true"
                />
                <Minus
                  v-else
                  class="about-compare-no"
                  :size="20"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ cell.text }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AboutSection>
</template>

<style scoped lang="scss">
// The frame is the containing block of the visually hidden cell labels.
// They are absolutely positioned, so without it they would escape the
// scroll frame and widen the page.
.about-compare-scroll {
  position: relative;
  min-width: 0;
  max-width: 100%;

  @media (max-width: 959px) {
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }
}

.about-compare {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    vertical-align: top;
  }

  tbody th,
  td {
    border-top: 1px solid var(--db-line);
    font-size: 15px;
    line-height: 24px;
  }

  td {
    position: relative;
    color: var(--db-ink-2);
  }

  th.about-compare-feature {
    width: 236px;
    padding-left: 0;
    font-weight: 600;
    color: var(--db-ink);
  }

  thead th.about-compare-feature {
    color: var(--db-muted);
  }

  &-service {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
    color: var(--db-ink);

    a {
      color: inherit;
      text-decoration: none;
    }

    &.is-ours {
      border-radius: var(--db-radius-3) var(--db-radius-3) 0 0;
      font-weight: 700;
      color: var(--db-tint-text);
    }
  }

  .is-ours {
    background: var(--db-tint);
  }

  td.is-ours {
    font-weight: 600;
    color: var(--db-ink);
  }

  &-yes,
  &-no {
    display: block;
    margin-top: 2px;
  }

  &-yes {
    color: var(--db-ink);
  }

  .is-ours &-yes {
    color: var(--db-tint-text);
  }

  &-no {
    color: var(--db-muted);
  }

  @media (max-width: 959px) {
    width: 920px;

    th.about-compare-feature {
      position: sticky;
      left: 0;
      z-index: 1;
      width: 150px;
      background: var(--db-paper);
    }
  }
}
</style>
