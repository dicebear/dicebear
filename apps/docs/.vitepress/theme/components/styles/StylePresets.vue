<script setup lang="ts">
/**
 * The preset gallery of a style page. Presets are plain option sets kept in
 * theme/presets/<style>.json. No definition or core feature backs them, so
 * whatever a card shows can be pasted into any of the six libraries or sent as
 * HTTP-API query parameters.
 *
 * The section is built to hold a lot of presets without taking over the page,
 * which already carries a long option table. Tiles stay small and wordless
 * enough to scan a grid of them; the reasoning, the full seed row and the code
 * open in a dialog.
 *
 * With `limit` the section shows a first row or two and sends the reader on to
 * /styles/<name>/presets/, which mounts the same component unlimited.
 */
import { computed, ref, shallowRef, watch } from 'vue';
import { kebabCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import type { StyleDefinition } from '@dicebear/core';
import { loadStylePresets, type StylePreset } from '@theme/config/presets';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import { loadAvatarStyleDefinition } from '@theme/utils/avatar/style';
import { track, styleLabel } from '@theme/utils/track';
import StylePresetTile from './StylePresetTile.vue';
import StylePresetDialog from './StylePresetDialog.vue';

const props = defineProps<{
  styleName: string;
  limit?: number;
  /** Wider tiles for the dedicated gallery page, which has room to spare. */
  large?: boolean;
}>();

const seeds = computed(() => getPreviewRowSeeds(props.styleName));

const presets = shallowRef<StylePreset[]>([]);
// Only the combination count in the dialog needs the definition, so a failed
// load leaves the gallery intact and merely drops that one number.
const definition = shallowRef<StyleDefinition>();

watch(
  () => props.styleName,
  async (name) => {
    const [loadedPresets, loadedDefinition] = await Promise.all([
      loadStylePresets(name),
      loadAvatarStyleDefinition(name).catch(() => undefined),
    ]);

    // The name can change while both loads are in flight; the newer watcher
    // run owns the refs from then on.
    if (props.styleName === name) {
      presets.value = loadedPresets;
      definition.value = loadedDefinition;
    }
  },
  { immediate: true },
);

const shown = computed(() =>
  props.limit === undefined
    ? presets.value
    : presets.value.slice(0, props.limit),
);

const allPresetsUrl = computed(
  () => `/styles/${kebabCase(props.styleName)}/presets/`,
);

// Four on a tile, all eight in the dialog. Same seeds everywhere, so the
// strips stay comparable across the grid and against the preview row at the
// top of the page.
const tileSeeds = computed(() => seeds.value.slice(0, 4));

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

function onSeeAll() {
  track('Style Presets: See All', { style: styleLabel(props.styleName) });
}
</script>

<template>
  <div v-if="presets.length > 0" class="style-presets">
    <p class="style-presets-intro">
      Each preset is a set of regular options, not a separate feature you
      install. Pick one to see its code, or open it in the playground and keep
      tuning from there.
    </p>

    <div class="style-presets-grid" :class="{ 'is-large': large }">
      <StylePresetTile
        v-for="preset in shown"
        :key="preset.id"
        :style-name="styleName"
        :preset="preset"
        :seeds="tileSeeds"
        @open="show(preset)"
      />

      <!--
        The link card rides along whenever the section is a teaser, even when
        the limit happens to fit every preset. Otherwise a style with exactly
        five of them would leave no way to reach its gallery page at all.
      -->
      <a
        v-if="limit !== undefined"
        :href="allPresetsUrl"
        class="style-presets-link no-icon"
        @click="onSeeAll"
      >
        <span class="style-presets-link-label">
          All {{ presets.length }} presets
        </span>
        <ArrowRight :size="16" />
      </a>
    </div>

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
.style-presets-intro {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
}

.style-presets-grid {
  display: grid;
  /* 220px lands three tiles across the docs content column and two on a
     tablet, without the avatars getting so small that the faces stop reading. */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;

  /* Two columns rather than another auto-fill: the gallery page drops the
     outline column, and auto-fill would spend the extra width on a fourth
     tile instead of on bigger avatars, which is the whole point of the page. */
  &.is-large {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
}

/* Sits in the grid as the tile after the last preset. Dashed, like the "Add
   Custom Style" card in the playground's style picker, so it reads as a way
   out of the grid rather than as another preset. */
.style-presets-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 1px dashed var(--ui-card-border-color);
  border-radius: var(--ui-card-radius);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ui-c-text-muted);
  text-align: center;
  text-decoration: none;
  transition:
    color var(--duration-fast) var(--ease-smooth),
    border-color var(--duration-fast) var(--ease-smooth);

  &:hover {
    color: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
  }
}
</style>
