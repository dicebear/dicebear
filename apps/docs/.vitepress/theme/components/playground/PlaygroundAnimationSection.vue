<script setup lang="ts">
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
    <div class="pg-field">
      <div class="pg-field-label">
        <label :for="switchId">Play animations</label>
        <span class="pg-field-tools">
          <PlaygroundFieldReset v-if="anythingSet" @click="resetAll()" />
          <SiteSwitch :id="switchId" v-model="animation" />
        </span>
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

    <div v-if="anythingPlays" class="pg-animation-pair">
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
  </div>
</template>

<style scoped lang="scss">
.pg-animation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pg-animation-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@container pg-options (max-width: 520px) {
  .pg-animation-pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
