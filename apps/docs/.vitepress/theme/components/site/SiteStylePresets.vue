<script setup lang="ts">
/**
 * The first four presets of a style as small strips, and the link to the
 * page with all of them. A click opens the same dialog the gallery uses.
 */
import { computed, ref, shallowRef, watch } from 'vue';
import { kebabCase } from 'change-case';
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
        class="site-style-presets-tile"
        @click="show(preset)"
      >
        <span class="site-style-presets-strip">
          <SiteAvatar
            v-for="seed in tileSeeds"
            :key="seed"
            sticker
            :style-name="styleName"
            :options="{ seed, ...preset.options }"
            mode="library"
          />
        </span>
        <span class="site-style-presets-name">{{ preset.name }}</span>
        <span class="site-text">{{ preset.summary }}</span>
      </button>
    </div>
    <a :href="allPresetsUrl" class="site-link-arrow site-style-presets-all">
      All {{ presets.length }} presets
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
  gap: 32px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(190px, 100%), 1fr));
    gap: 40px 24px;
  }

  &-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var(--db-ink);
    text-align: left;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: 6px;
      border-radius: var(--db-radius-4);
    }
  }

  /* Three stickers that overlap, turned in turn; they rise a little on
     hover. */
  &-strip {
    display: flex;
    width: 100%;
    margin-bottom: 16px;
    padding-right: 12%;

    > :deep(.site-sticker) {
      --site-sticker-edge: 3.5%;

      flex: 1;
      transition: transform 0.25s var(--ease-spring);
    }

    > :deep(.site-sticker + .site-sticker) {
      margin-left: -8%;
    }

    > :deep(.site-sticker:nth-child(1)) {
      transform: rotate(-5deg);
    }

    > :deep(.site-sticker:nth-child(2)) {
      transform: translateY(-6%) rotate(2deg);
    }

    > :deep(.site-sticker:nth-child(3)) {
      transform: rotate(6deg);
    }
  }

  &-tile:hover &-strip > :deep(.site-sticker) {
    translate: 0 -4px;
  }

  &-name {
    font-family: var(--db-font-display);
    font-size: 22px;
    line-height: 28px;
    font-weight: 700;
  }

  &-all {
    align-self: flex-start;
  }
}
</style>
