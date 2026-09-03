<script setup lang="ts">
import { computed } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import useStore from '@theme/stores/playground';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';
import { animationPlays } from './animationState';

const props = defineProps<{
  // The style's animation names, as the loaded style reports them. Empty when
  // every timeline is unnamed.
  names: readonly string[];
}>();

const store = useStore();

const animationKey = 'animation';
const speedKey = 'animationSpeed';
const delayKey = 'animationDelay';
const keys = [animationKey, speedKey, delayKey];

const animation = computed({
  get: () => store.avatarStyleOptions[animationKey] === true,
  set: (val: boolean) => {
    if (val) {
      store.avatarStyleOptions[animationKey] = true;
    } else {
      // The speed and delay have no meaning without the animations and would
      // otherwise linger in the emitted options.
      for (const key of keys) {
        delete store.avatarStyleOptions[key];
      }
    }
  },
});

// The speed and delay apply to every animation that plays, also to one that
// plays through its own switch while the global one is off.
const anythingPlays = computed(
  () =>
    animation.value ||
    props.names.some((name) => animationPlays(store.avatarStyleOptions, name)),
);
const anythingSet = computed(() => keys.some((key) => store.isOptionSet(key)));

function resetAll() {
  for (const key of keys) {
    if (store.isOptionSet(key)) {
      store.resetOption(key);
    }
  }
}
</script>

<template>
  <div class="pg-animation">
    <div class="pg-field">
      <div class="pg-field-label pg-animation-toggle-row">
        <ToggleSwitch v-model="animation" />
        <span>Play animations</span>
        <PlaygroundFieldReset v-if="anythingSet" @click="resetAll()" />
      </div>
      <p class="pg-help">
        Plays the style's built-in animations in the SVG output. Raster formats
        (PNG, JPEG, WebP, AVIF) always show the resting state, and viewers with
        a reduced motion preference see the avatar still.
        <template v-if="names.length > 0">
          Each animation below can override this switch, the speed and the delay
          for itself.
        </template>
      </p>
    </div>

    <template v-if="anythingPlays">
      <PlaygroundRangeField
        label="Speed"
        option-key="animationSpeed"
        :min="0.1"
        :max="10"
        :step="0.05"
        unit="×"
        :default-single="1"
      />

      <PlaygroundRangeField
        label="Delay"
        option-key="animationDelay"
        :min="-10"
        :max="10"
        :step="0.1"
        unit="s"
        :default-single="0"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.pg-animation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pg-animation-toggle-row {
  justify-content: flex-start;
  gap: 10px;
}
</style>
