<script setup lang="ts">
/**
 * Loads a preset into the playground, so a ready-made look is one click away
 * instead of a trip to the style page and back through a deep link.
 *
 * Built like the style picker next to it: a compact trigger naming the current
 * choice, with the gallery itself behind a dialog. Presets are a starting
 * point, not something anyone tunes on every visit, so they do not earn
 * permanent space in the options column.
 */
import { computed, ref, shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import ChevronRightIcon from '@primevue/icons/chevronright';
import { loadStylePresets, type StylePreset } from '@theme/config/presets';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import useStore from '@theme/stores/playground';
import { UiAvatar, UiDialog } from '../ui';
import StylePresetTile from '@theme/components/styles/StylePresetTile.vue';

const store = useStore();
const { avatarStyleName, avatarStyleOptionsWithoutDefaults } =
  storeToRefs(store);

/**
 * Whether the picker has something to offer. The parent draws the "Preset"
 * heading around this component and cannot answer that itself: the preset file
 * is a chunk fetched on demand, so a style having one is not the same as its
 * presets being here. Reported from below, so the heading turns up with the
 * trigger rather than over empty space, and stays away if the fetch fails.
 */
const ready = defineModel<boolean>('ready', { default: false });

const open = ref(false);

const presets = shallowRef<StylePreset[]>([]);

watch(
  avatarStyleName,
  async (name) => {
    // Dropped before the fetch, not after it. The list belongs to the style it
    // was loaded for, and leaving it up while the next style's file is on the
    // way offers presets whose options that style does not accept.
    presets.value = [];

    const loaded = await loadStylePresets(name);

    if (avatarStyleName.value === name) {
      presets.value = loaded;
    }
  },
  { immediate: true },
);

// Custom styles have no seed row of their own, and getPreviewRowSeeds throws
// rather than guessing. They never carry presets either, so this only guards
// the lookup itself.
const seeds = computed(() => {
  if (presets.value.length === 0) {
    return [];
  }

  try {
    return getPreviewRowSeeds(avatarStyleName.value).slice(0, 4);
  } catch {
    return [];
  }
});

const shown = computed(
  () => presets.value.length > 0 && seeds.value.length > 0,
);

watch(shown, (value) => (ready.value = value), { immediate: true });

/**
 * The reset entry, first in the grid. Modelled as a preset with no options so
 * it renders through the same tile and goes through the same apply path, which
 * clears everything and keeps the seed.
 */
const DEFAULT_PRESET: StylePreset = {
  id: '__default',
  name: 'Default',
  summary: 'The style as it ships, with nothing set.',
  description: '',
  options: {},
};

/**
 * An option set as a comparable string. Keys are sorted, because resetting a
 * field and setting it again moves it to the end of the object: the values
 * would still match the preset while the serialisation no longer did, and the
 * trigger would claim the options were changed by hand.
 */
function fingerprint(options: Record<string, unknown>): string {
  return JSON.stringify(
    Object.keys(options)
      .sort()
      .map((key) => [key, options[key]]),
  );
}

/** The preset whose options are applied right now, if the two still match. */
const active = computed<StylePreset | undefined>(() => {
  const options = avatarStyleOptionsWithoutDefaults.value;

  if (Object.keys(options).length === 0) {
    return DEFAULT_PRESET;
  }

  const current = fingerprint(options);

  return presets.value.find(
    (preset) => fingerprint(preset.options) === current,
  );
});

const choices = computed(() => [DEFAULT_PRESET, ...presets.value]);

// Without a matching preset the trigger says "Custom", so it has to show the
// options the reader actually set. Falling back to the preset's options would
// pair that label with the untouched default avatar.
const triggerOptions = computed(() => ({
  seed: seeds.value[0] ?? '',
  ...(active.value?.options ?? avatarStyleOptionsWithoutDefaults.value),
}));

function choose(preset: StylePreset) {
  store.applyPreset(preset);
  open.value = false;
}
</script>

<template>
  <div v-if="shown">
    <button type="button" class="pg-preset-trigger" @click="open = true">
      <span class="pg-preset-trigger-avatar">
        <UiAvatar
          :size="40"
          :style-name="avatarStyleName"
          :style-options="triggerOptions"
          mode="library"
          alt=""
        />
      </span>

      <span class="pg-preset-trigger-text">
        <span class="pg-preset-trigger-name">{{
          active ? active.name : 'Custom'
        }}</span>
        <span class="pg-preset-trigger-hint">{{
          active ? active.summary : 'Options changed by hand'
        }}</span>
      </span>

      <ChevronRightIcon class="pg-preset-trigger-chevron" />
    </button>

    <UiDialog v-model:open="open" header="Choose a preset" max-width="760px">
      <p class="pg-preset-dialog-intro">
        A preset replaces the options below with a complete set of its own, and
        Default clears them again. Your seed stays either way, so you keep
        looking at the same avatars.
      </p>

      <div class="pg-preset-dialog-grid">
        <StylePresetTile
          v-for="preset in choices"
          :key="preset.id"
          :style-name="avatarStyleName"
          :preset="preset"
          :seeds="seeds"
          :opens-dialog="false"
          :class="{ 'is-active': active?.id === preset.id }"
          @open="choose(preset)"
        />
      </div>
    </UiDialog>
  </div>
</template>

<style scoped lang="scss">
.pg-preset-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 16px 8px 8px;
  background: var(--p-content-background);
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
  color: var(--p-accordion-header-color);
  cursor: pointer;
  text-align: left;
  transition: color var(--duration-fast);

  &:hover {
    color: var(--p-accordion-header-hover-color);
  }

  &:hover &-chevron {
    color: var(--p-accordion-header-toggle-icon-hover-color);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--p-form-field-focus-border-color);
  }

  &-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: var(--vp-radius-xs);
    overflow: hidden;
  }

  &-text {
    flex: 1;
    min-width: 0;
  }

  &-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-hint {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    line-height: 1.3;
    color: var(--ui-c-text-subtle);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--p-accordion-header-toggle-icon-color);
    transition: color var(--duration-fast);
  }
}

.pg-preset-dialog-intro {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.pg-preset-dialog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

// The tile marks the applied preset with the same brand border it uses for
// hover, so the state reads without adding a second visual language.
:deep(.preset-tile.is-active) {
  border-color: var(--vp-c-brand-1);
}
</style>
