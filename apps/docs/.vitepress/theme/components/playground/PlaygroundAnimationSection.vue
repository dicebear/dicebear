<script setup lang="ts">
import { computed } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import Checkbox from 'primevue/checkbox';
import useStore from '@theme/stores/playground';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const props = defineProps<{
  // The style's animation names from the options descriptor. Empty when
  // every timeline is unnamed. The section then offers only the toggle.
  names: string[];
}>();

const store = useStore();

const animationKey = 'animation';
const speedKey = 'animationSpeed';
const delayKey = 'animationDelay';

// The switch, speed and delay option of one animation, `blinkAnimation`,
// `blinkAnimationSpeed` and `blinkAnimationDelay` for `blink`.
function switchKeyFor(name: string): string {
  return `${name}Animation`;
}

function speedKeyFor(name: string): string {
  return `${name}AnimationSpeed`;
}

function delayKeyFor(name: string): string {
  return `${name}AnimationDelay`;
}

const allKeys = computed(() => [
  animationKey,
  speedKey,
  delayKey,
  ...props.names.flatMap((name) => [
    switchKeyFor(name),
    speedKeyFor(name),
    delayKeyFor(name),
  ]),
]);

// The global switch as set. Anything but `true` leaves the toggle down.
const globalOn = computed(
  () => store.avatarStyleOptions[animationKey] === true,
);

// Whether the timelines of one name play: their own switch when set, the
// global one otherwise.
function plays(name: string): boolean {
  const value = store.avatarStyleOptions[switchKeyFor(name)];

  return typeof value === 'boolean' ? value : globalOn.value;
}

const playingNames = computed(() => props.names.filter(plays));
const anythingPlays = computed(
  () => globalOn.value || playingNames.value.length > 0,
);
const anythingSet = computed(() =>
  allKeys.value.some((key) => store.isOptionSet(key)),
);

// Turning the toggle off clears every animation option. A speed or a named
// switch has no meaning without the animations and would otherwise linger in
// the emitted options.
function turnOff() {
  for (const key of allKeys.value) {
    delete store.avatarStyleOptions[key];
  }
}

// The reset next to the toggle clears all of them, for the same reason.
function resetAnimation() {
  for (const key of allKeys.value) {
    if (store.isOptionSet(key)) {
      store.resetOption(key);
    }
  }
}

const animation = computed({
  get: () => globalOn.value,
  set: (val: boolean) => {
    if (val) {
      store.avatarStyleOptions[animationKey] = true;
    } else {
      turnOff();
    }
  },
});

// A name's switch is written only where it differs from the global one, so
// the emitted options stay as short as the same result allows. Switching a
// name off takes its speed and delay with it.
function toggleName(name: string, checked: boolean) {
  if (checked === globalOn.value) {
    delete store.avatarStyleOptions[switchKeyFor(name)];
  } else {
    store.avatarStyleOptions[switchKeyFor(name)] = checked;
  }
  if (!checked) {
    delete store.avatarStyleOptions[speedKeyFor(name)];
    delete store.avatarStyleOptions[delayKeyFor(name)];
  }
}
</script>

<template>
  <div class="pg-animation">
    <div class="pg-field">
      <div class="pg-field-label pg-animation-toggle-row">
        <ToggleSwitch v-model="animation" />
        <span>Play animations</span>
        <PlaygroundFieldReset v-if="anythingSet" @click="resetAnimation()" />
      </div>
      <p class="pg-help">
        Plays the style's built-in animations in the SVG output. Raster formats
        (PNG, JPEG, WebP, AVIF) always show the resting state, and viewers with
        a reduced motion preference see the avatar still.
      </p>
    </div>

    <div v-if="names.length > 0" class="pg-field">
      <div class="pg-field-label">
        <span>Animations</span>
      </div>
      <div class="pg-animation-names">
        <label v-for="name in names" :key="name" class="pg-animation-name">
          <Checkbox
            :model-value="plays(name)"
            :binary="true"
            @update:model-value="
              (checked: boolean) => toggleName(name, checked)
            "
          />
          <span>{{ name }}</span>
        </label>
      </div>
      <p class="pg-help">
        Switch single animations on or off. A name's own switch wins over the
        toggle above.
      </p>
    </div>

    <PlaygroundRangeField
      v-if="anythingPlays"
      label="Speed"
      option-key="animationSpeed"
      :min="0.1"
      :max="10"
      :step="0.05"
      unit="×"
      :default-single="1"
    />
    <PlaygroundRangeField
      v-if="anythingPlays"
      label="Delay"
      option-key="animationDelay"
      :min="-10"
      :max="10"
      :step="0.1"
      unit="s"
      :default-single="0"
    />

    <template v-for="name in playingNames" :key="name">
      <PlaygroundRangeField
        :label="`Speed of ${name}`"
        :option-key="speedKeyFor(name)"
        :min="0.1"
        :max="10"
        :step="0.05"
        unit="×"
        :default-single="1"
      />
      <PlaygroundRangeField
        :label="`Delay of ${name}`"
        :option-key="delayKeyFor(name)"
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
  gap: 24px;
}

.pg-animation-toggle-row {
  flex-wrap: wrap;

  span {
    flex: 1;
    min-width: 0;
  }
}

.pg-animation-names {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.pg-animation-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>
