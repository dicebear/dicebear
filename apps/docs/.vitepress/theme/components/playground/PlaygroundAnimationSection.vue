<script setup lang="ts">
/**
 * The switch for every animation of the style, with the speed and delay
 * they share.
 */
import { computed, useId } from 'vue';
import SiteSwitch from '@theme/components/site/SiteSwitch.vue';
import useStore from '@theme/stores/playground';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';
import { animationPlays, animationSwitch } from './animationState';

const props = defineProps<{
  // The style's animation names, as the loaded style reports them. Empty when
  // every timeline is unnamed.
  names: readonly string[];
}>();

const store = useStore();
const switchId = useId();

const animationKey = 'animation';
const speedKey = 'animationSpeed';
const delayKey = 'animationDelay';
const keys = [animationKey, speedKey, delayKey];

const animation = computed({
  get: () => store.avatarStyleOptions[animationKey] === true,
  set: (val: boolean) => {
    if (val) {
      store.avatarStyleOptions[animationKey] = true;
      return;
    }

    delete store.avatarStyleOptions[animationKey];

    // A timeline on its own switch keeps playing and takes the global speed
    // and delay, so those stay while any such switch is on. Otherwise they
    // would only linger in the emitted options.
    const stillPlays = props.names.some(
      (name) => animationSwitch(store.avatarStyleOptions, name) === true,
    );

    if (!stillPlays) {
      delete store.avatarStyleOptions[speedKey];
      delete store.avatarStyleOptions[delayKey];
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
    <div class="pg-animation-switch">
      <label :for="switchId">Play animations</label>
      <PlaygroundFieldReset v-if="anythingSet" @click="resetAll()" />
      <SiteSwitch :id="switchId" v-model="animation" />
    </div>

    <div v-if="anythingPlays" class="pg-fields">
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
    </div>

    <p class="pg-help">
      <template v-if="names.length > 0">
        Each animation follows the switch above unless it has one of its own.
      </template>
      Raster downloads show the resting frame.
    </p>
  </div>
</template>

<style scoped lang="scss">
.pg-animation {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-animation-switch {
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    flex: 1;
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
    cursor: pointer;
  }
}
</style>
