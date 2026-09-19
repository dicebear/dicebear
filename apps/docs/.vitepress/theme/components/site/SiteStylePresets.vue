<script setup lang="ts">
/**
 * The first four presets of a style as small strips, and the link to the
 * page with all of them. A click opens the same dialog the gallery uses.
 */
import { computed, ref, shallowRef, watch } from 'vue';
import { kebabCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import type { StyleDefinition } from '@dicebear/core';
import { loadStylePresets, type StylePreset } from '@theme/config/presets';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import { loadAvatarStyleDefinition } from '@theme/utils/avatar/style';
import { styleLabel, track } from '@theme/utils/track';
import StylePresetDialog from '../styles/StylePresetDialog.vue';
import SiteAvatar from './SiteAvatar.vue';

const props = withDefaults(
  defineProps<{
    styleName: string;
    limit?: number;
  }>(),
  { limit: 4 },
);

const emit = defineEmits<{
  loaded: [count: number];
}>();

const seeds = computed(() => getPreviewRowSeeds(props.styleName));
const tileSeeds = computed(() => seeds.value.slice(0, 3));
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
      emit('loaded', loadedPresets.length);
    }
  },
  { immediate: true },
);

const shown = computed(() => presets.value.slice(0, props.limit));
const allPresetsUrl = computed(
  () => `/styles/${kebabCase(props.styleName)}/presets/`,
);

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
  <div v-if="presets.length > 0" class="site-style-presets">
    <div class="site-style-presets-grid">
      <button
        v-for="preset in shown"
        :key="preset.id"
        type="button"
        class="site-style-presets-tile hv-row"
        @click="show(preset)"
      >
        <span class="site-style-presets-strip">
          <SiteAvatar
            v-for="seed in tileSeeds"
            :key="seed"
            :style-name="styleName"
            :options="{ seed, ...preset.options }"
            :size="62"
            :radius="15"
            mode="library"
          />
        </span>
        <span class="site-style-presets-name">{{ preset.name }}</span>
        <span class="site-small">{{ preset.summary }}</span>
      </button>
    </div>
    <a :href="allPresetsUrl" class="site-style-presets-all hv-link">
      All {{ presets.length }} presets
      <ArrowRight :size="16" />
    </a>
    <StylePresetDialog
      v-model:open="open"
      :style-name="styleName"
      :preset="active"
      :seeds="seeds"
      :definition="definition"
    />
  </div>
</template>

<style scoped lang="scss">
.site-style-presets {
  display: flex;
  flex-direction: column;
  gap: 40px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 40px 24px;

    @media (max-width: 959px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: var(--db-radius-2);
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 4px;
    }
  }

  /* Three tiles of 62 pixels that shrink with a narrow column. */
  &-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 62px));
    gap: 6px;
    width: 100%;
    margin-bottom: 8px;

    :deep(.site-avatar) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }
  }

  &-name {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  &-all {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    color: var(--db-brand-text);
  }
}
</style>
