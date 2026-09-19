<script setup lang="ts">
/**
 * The presets page of a style: the head the style page has, four presets as
 * an aside, then every preset as a row. The same three seeds sit in every
 * row, so the presets compare against each other. The lead is written here
 * because it names the style.
 */
import { computed, ref, shallowRef, watch } from 'vue';
import { capitalCase, kebabCase } from 'change-case';
import { ArrowLeft } from '@lucide/vue';
import type { StyleDefinition } from '@dicebear/core';
import { loadStylePresets, type StylePreset } from '@theme/config/presets';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import { getStyleCategory } from '@theme/config/styleCategories';
import { loadAvatarStyleDefinition } from '@theme/utils/avatar/style';
import { styleLabel, track } from '@theme/utils/track';
import StylePresetDialog from '../styles/StylePresetDialog.vue';
import SiteAvatar from './SiteAvatar.vue';
import SitePageHead from './SitePageHead.vue';
import SitePresetRow from './SitePresetRow.vue';

const props = defineProps<{
  styleName: string;
}>();

const slug = computed(() => kebabCase(props.styleName));
const styleTitle = computed(() => capitalCase(props.styleName));
const category = computed(() => getStyleCategory(slug.value));

const presets = shallowRef<StylePreset[]>([]);
const definition = shallowRef<StyleDefinition>();

watch(
  () => props.styleName,
  async (name) => {
    const [loadedPresets, loadedDefinition] = await Promise.all([
      loadStylePresets(name),
      loadAvatarStyleDefinition(name).catch(() => undefined),
    ]);
    if (props.styleName === name) {
      presets.value = loadedPresets;
      definition.value = loadedDefinition;
    }
  },
  { immediate: true },
);

const seeds = computed(() => getPreviewRowSeeds(slug.value).slice(0, 3));
const allSeeds = computed(() => getPreviewRowSeeds(slug.value));

const words = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
];

const title = computed(() => {
  const n = presets.value.length;
  const word = words[n] ?? String(n);
  const count = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  return `${count} ${styleTitle.value} starting ${n === 1 ? 'point' : 'points'}`;
});

/** "Lorelei's", and only an apostrophe after a name that ends in s. */
const possessive = computed(() =>
  styleTitle.value.endsWith('s')
    ? `${styleTitle.value}'`
    : `${styleTitle.value}'s`,
);

const crumbs = computed(() => [
  { text: 'Styles', link: '/styles/' },
  { text: category.value, link: `/styles/#${category.value.toLowerCase()}` },
  { text: styleTitle.value, link: `/styles/${slug.value}/` },
  { text: 'Presets' },
]);

const chips = computed(() => [
  { text: `${presets.value.length} presets` },
  { text: 'Any library', href: '/integrations/' },
  { text: 'HTTP API', href: '/integrations/http-api/' },
]);

/** Four presets for the aside, spread across the list so the colors vary. */
const featured = computed(() => {
  const list = presets.value;
  if (list.length <= 4) {
    return list;
  }
  const step = list.length / 4;
  return [0, 1, 2, 3].map((i) => list[Math.floor(i * step + step / 2)]);
});

const active = ref<StylePreset>();
const open = ref(false);

function show(preset: StylePreset) {
  active.value = preset;
  open.value = true;
  track('Style Presets: Opened', {
    style: styleLabel(props.styleName),
    preset: preset.id,
  });
}
</script>

<template>
  <div class="site-presets-page">
    <SitePageHead
      :crumbs="crumbs"
      :title="title"
      :chips="chips"
      lead-size="body"
    >
      A preset sets a few of {{ possessive }} options and leaves every other one
      to you. Read its code or open it in the Playground and keep tuning.
      Options a preset leaves alone keep varying with the seed, so each row
      lists how many distinct avatars it still gives you.
      <template #aside>
        <div class="site-presets-page-aside">
          <div class="site-presets-page-aside-grid">
            <SiteAvatar
              v-for="(preset, index) in featured"
              :key="preset.id"
              class="site-pop"
              :style="{ animationDelay: `${300 + index * 100}ms` }"
              :style-name="styleName"
              :options="{ seed: seeds[0], ...preset.options }"
              mode="library"
              :size="194"
              :radius="32"
              :lazy="false"
              :alt="`${preset.name} on the seed ${seeds[0]}`"
            />
          </div>
          <span class="site-text site-presets-page-aside-caption">
            {{ featured.map((preset) => preset.name).join(', ') }} on the seed
            {{ seeds[0] }}.
          </span>
        </div>
      </template>
    </SitePageHead>

    <div class="site-container site-presets-page-list">
      <div class="site-presets-page-columns">
        <span class="site-label">Preset</span>
        <div class="site-presets-page-seeds">
          <span v-for="seed in seeds" :key="seed" class="site-label">{{
            seed
          }}</span>
        </div>
      </div>
      <SitePresetRow
        v-for="preset in presets"
        :key="preset.id"
        :style-name="styleName"
        :preset="preset"
        :seeds="seeds"
        :definition="definition"
        @open="show(preset)"
      />
    </div>

    <div class="site-container site-presets-page-end">
      <div class="site-presets-page-back">
        <span class="site-label">Back to the style</span>
        <a
          :href="`/styles/${slug}/`"
          class="site-heading site-presets-page-back-link hv-row"
        >
          <ArrowLeft :size="20" class="hv-chev" />
          {{ styleTitle }}
        </a>
      </div>
      <span class="site-text site-presets-page-note">
        Presets exist for every style that ships them. Missing one you use a
        lot? The files are plain JSON in the docs repository.
      </span>
    </div>

    <StylePresetDialog
      v-model:open="open"
      :style-name="styleName"
      :preset="active"
      :seeds="allSeeds"
      :definition="definition"
    />
  </div>
</template>

<style scoped lang="scss">
.site-presets-page {
  :deep(.site-page-head-lead) {
    max-width: 720px;
  }

  &-aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 12px;

    &-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;

      :deep(.site-avatar) {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1;
      }
    }

    &-caption {
      color: var(--db-muted);
      text-align: center;
    }

    @media (max-width: 959px) {
      max-width: 400px;
      padding-top: 0;
    }
  }

  &-list {
    margin-top: 120px;
    border-bottom: 1px solid var(--db-line);

    @media (max-width: 767px) {
      margin-top: 72px;
    }
  }

  &-columns {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr) auto;
    gap: 48px;
    padding-bottom: 16px;

    @media (max-width: 959px) {
      display: none;
    }
  }

  &-seeds {
    display: flex;
    gap: 12px;

    .site-label {
      width: 132px;
      text-align: center;
    }
  }

  &-end {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    padding-top: 120px;
    padding-bottom: 96px;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
      padding-top: 80px;
      padding-bottom: 64px;
    }
  }

  &-back {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;

    &-link {
      display: inline-flex;
      align-items: center;
      gap: 12px;

      svg {
        flex-shrink: 0;
      }
    }
  }

  &-note {
    max-width: 420px;
    color: var(--db-muted);
    text-align: right;

    @media (max-width: 767px) {
      text-align: left;
    }
  }
}
</style>
