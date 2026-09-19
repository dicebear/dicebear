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
import { loadStylePresets, type StylePreset } from '@theme/config/presets';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import useStore from '@theme/stores/playground';
import SiteDialog from '../site/SiteDialog.vue';
import StylePresetTile from '@theme/components/styles/StylePresetTile.vue';
import PlaygroundPickerTrigger from './PlaygroundPickerTrigger.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';

const store = useStore();
const { avatarStyleName, avatarStyleOptionsWithoutDefaults, seed } =
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

// The thumbnails draw the seed of the playground, so every tile shows what
// the preset does to the avatar the reader is working on.
const tileSeeds = computed(() => [seed.value || (seeds.value[0] ?? '')]);

const triggerOptions = computed(() => ({
  ...avatarStyleOptionsWithoutDefaults.value,
  seed: tileSeeds.value[0],
}));

function choose(preset: StylePreset) {
  store.applyPreset(preset);
  open.value = false;
}
</script>

<template>
  <div v-if="shown">
    <PlaygroundPickerTrigger
      :title="active ? active.name : 'Custom'"
      :hint="active ? active.summary : 'Options changed by hand'"
      @click="open = true"
    >
      <template #thumb>
        <PlaygroundThumb
          :style-name="avatarStyleName"
          :options="triggerOptions"
        />
      </template>
    </PlaygroundPickerTrigger>

    <SiteDialog v-model:open="open" header="Choose a preset" max-width="860px">
      <div class="pg-preset-dialog">
        <p class="pg-preset-dialog-intro">
          A preset replaces the options below with a complete set of its own,
          and Default clears them again. Your seed stays either way, so you
          keep looking at the same avatars.
        </p>

        <div class="pg-preset-dialog-grid">
          <StylePresetTile
            v-for="preset in choices"
            :key="preset.id"
            :style-name="avatarStyleName"
            :preset="preset"
            :seeds="tileSeeds"
            :opens-dialog="false"
            :aria-pressed="active?.id === preset.id"
            @open="choose(preset)"
          />
        </div>
      </div>
    </SiteDialog>
  </div>
</template>

<style scoped lang="scss">
.pg-preset-dialog {
  padding: 20px 28px 28px;

  @media (max-width: 640px) {
    padding: 16px 20px 20px;
  }

  &-intro {
    margin: 0 0 20px;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 767px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
