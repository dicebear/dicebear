<script setup lang="ts">
import { ref } from 'vue';
import { Check, X } from '@lucide/vue';
import { ThemeOptions } from '@theme/types';
import { useData } from 'vitepress';
import { UiContainer, UiSection, UiSectionHeader, UiCard } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const { theme } = useData<ThemeOptions>();
const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const stars = theme.value.githubStars ?? {};
const styleCount = Object.keys(theme.value.avatarStyles ?? {}).length;

type CellValue = 'yes' | 'no' | string;

interface ComparisonRow {
  feature: string;
  dicebear: CellValue;
  avvvatars: CellValue;
  jdenticon: CellValue;
  multiavatar: CellValue;
  boringAvatars: CellValue;
}

const rows: ComparisonRow[] = [
  {
    feature: 'GitHub Stars',
    dicebear: stars['dicebear/dicebear'] || '8k+',
    avvvatars: stars['nusu/avvvatars'] || '2k+',
    jdenticon: stars['dmester/jdenticon'] || '1.7k+',
    multiavatar: stars['multiavatar/Multiavatar'] || '1.9k+',
    boringAvatars: stars['boringdesigners/boring-avatars'] || '6k+',
  },
  {
    feature: 'Avatar Styles',
    dicebear: `${styleCount}`,
    avvvatars: '2',
    jdenticon: '1',
    multiavatar: '1',
    boringAvatars: '6',
  },
  {
    feature: 'Customizable Options',
    dicebear: 'Extensive',
    avvvatars: 'Limited',
    jdenticon: 'Limited',
    multiavatar: 'Limited',
    boringAvatars: 'Extensive',
  },
  {
    feature: 'HTTP API',
    dicebear: 'free',
    avvvatars: 'no',
    jdenticon: 'no',
    multiavatar: 'no',
    boringAvatars: 'paid',
  },
  {
    feature: 'CLI',
    dicebear: 'yes',
    avvvatars: 'no',
    jdenticon: 'yes',
    multiavatar: 'no',
    boringAvatars: 'no',
  },
  {
    feature: 'Languages',
    dicebear: 'JS/TS',
    avvvatars: 'JS/TS',
    jdenticon: 'JS, .NET, PHP',
    multiavatar: 'JS, PHP, Python',
    boringAvatars: 'JS',
  },
  {
    feature: 'Dependencies',
    dicebear: '\u2013',
    avvvatars: 'React',
    jdenticon: '\u2013',
    multiavatar: '\u2013',
    boringAvatars: 'React',
  },
  {
    feature: 'Output Formats',
    dicebear: 'SVG, PNG, JPEG, WebP, AVIF',
    avvvatars: 'SVG',
    jdenticon: 'SVG, PNG',
    multiavatar: 'SVG',
    boringAvatars: 'SVG',
  },
  {
    feature: 'Design License',
    dicebear: 'Varies',
    avvvatars: 'MIT',
    jdenticon: 'MIT',
    multiavatar: 'Custom',
    boringAvatars: 'MIT',
  },
  {
    feature: 'Open Source',
    dicebear: 'yes',
    avvvatars: 'yes',
    jdenticon: 'yes',
    multiavatar: 'yes',
    boringAvatars: 'yes',
  },
  {
    feature: 'Deterministic',
    dicebear: 'yes',
    avvvatars: 'yes',
    jdenticon: 'yes',
    multiavatar: 'yes',
    boringAvatars: 'yes',
  },
];

const services = [
  { name: 'DiceBear', url: 'https://www.dicebear.com' },
  { name: 'Boring Avatars', url: 'https://boringavatars.com' },
  { name: 'Avvvatars', url: 'https://avvvatars.com' },
  { name: 'Multiavatar', url: 'https://multiavatar.com' },
  { name: 'Jdenticon', url: 'https://jdenticon.com' },
];
const serviceKeys: (keyof ComparisonRow)[] = ['dicebear', 'boringAvatars', 'avvvatars', 'multiavatar', 'jdenticon'];

function getCellValue(row: ComparisonRow, key: keyof ComparisonRow): CellValue {
  return row[key];
}
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-comparison-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-comparison-header"
        badge="Comparison"
        description="Every tool has its strengths. Choose what works best for your project."
      >
        <template #headline>How DiceBear <strong>Compares</strong></template>
      </UiSectionHeader>

      <UiCard padding="md" radius="lg" class="app-comparison-table-card">
        <div class="app-comparison-table-wrapper">
          <table class="app-comparison-table">
            <thead>
              <tr>
                <th class="app-comparison-feature-col">Feature</th>
                <th
                  v-for="(service, index) in services"
                  :key="index"
                  :class="{ 'app-comparison-highlight-col': index === 0 }"
                >
                  <a :href="service.url" target="_blank" rel="noopener" class="app-comparison-service-link">{{ service.name }}</a>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                <td class="app-comparison-feature-col">{{ row.feature }}</td>
                <td
                  v-for="(key, colIndex) in serviceKeys"
                  :key="key"
                  :class="{ 'app-comparison-highlight-col': colIndex === 0 }"
                >
                  <span v-if="getCellValue(row, key) === 'yes'" class="app-comparison-cell-yes">
                    <Check :size="18" />
                  </span>
                  <span v-else-if="getCellValue(row, key) === 'free'" class="app-comparison-cell-free">
                    Free
                  </span>
                  <span v-else-if="getCellValue(row, key) === 'paid'" class="app-comparison-cell-paid">
                    Paid
                  </span>
                  <span v-else-if="getCellValue(row, key) === 'no'" class="app-comparison-cell-no">
                    <X :size="18" />
                  </span>
                  <span v-else class="app-comparison-cell-text">{{ getCellValue(row, key) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCard>

      <p class="app-comparison-note">
        This comparison is based on publicly available information and may not reflect the latest updates.
        Each tool has its own strengths &mdash; choose what works best for your project.
      </p>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-comparison {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
      radial-gradient(ellipse 50% 50% at 50% 100%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent);
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
