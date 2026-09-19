<script setup lang="ts">
import { computed } from 'vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
import useStore from '@theme/stores/playground';
import PlaygroundRangeField from './PlaygroundRangeField.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';
import { animationPlays, animationSwitch } from './animationState';

const props = defineProps<{
  name: string;
}>();

const store = useStore();

const switchKey = computed(() => `${props.name}Animation`);
const speedKey = computed(() => `${props.name}AnimationSpeed`);
const delayKey = computed(() => `${props.name}AnimationDelay`);

// `follow` leaves the option unset, so the animation takes the switch under
// "All animations". `on` and `off` write the option and win over it.
type Choice = 'follow' | 'on' | 'off';

const choices: { label: string; value: Choice }[] = [
  { label: 'Follow', value: 'follow' },
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
];

const choice = computed<Choice>({
  get: () => {
    const own = animationSwitch(store.avatarStyleOptions, props.name);

    return own === undefined ? 'follow' : own ? 'on' : 'off';
  },
  set: (val: Choice) => {
    if (val === 'follow') {
      delete store.avatarStyleOptions[switchKey.value];
    } else {
      store.avatarStyleOptions[switchKey.value] = val === 'on';
    }

    // A speed or delay for an animation that stays still has no effect and
    // would only linger in the emitted options.
    if (val === 'off') {
      delete store.avatarStyleOptions[speedKey.value];
      delete store.avatarStyleOptions[delayKey.value];
    }
  },
});

const plays = computed(() =>
  animationPlays(store.avatarStyleOptions, props.name),
);
const globalOn = computed(() => store.avatarStyleOptions.animation === true);

const status = computed(() => {
  if (choice.value === 'follow') {
    return globalOn.value
      ? 'Plays, because all animations are on.'
      : 'Still, because all animations are off.';
  }

  return choice.value === 'on'
    ? 'Plays on its own switch, whatever the setting for all animations.'
    : 'Stays still, whatever the setting for all animations.';
});

// The value an unset field inherits: the option under "All animations" as
// the user wrote it, or the core's default.
type RangeValue = number | [number, number];

function inherited(key: string, fallback: number): RangeValue {
  const value = store.avatarStyleOptions[key];

  if (typeof value === 'number') {
    return value;
  }

  if (Array.isArray(value) && value.length === 2) {
    return [Number(value[0]), Number(value[1])];
  }

  return fallback;
}

function formatInherited(value: RangeValue, unit: string): string {
  return typeof value === 'number'
    ? `${value}${unit}`
    : `${value[0]}${unit} to ${value[1]}${unit}`;
}

// Speed and delay are the same field twice: a range field once the animation
// has its own value, the inherited value with an override action before that.
const fields = computed(() => [
  {
    label: 'Speed',
    key: speedKey.value,
    min: 0.1,
    max: 10,
    step: 0.05,
    unit: '×',
    fallback: 1,
    inherited: inherited('animationSpeed', 1),
    help: 'Follows the speed under all animations.',
  },
  {
    label: 'Delay',
    key: delayKey.value,
    min: -10,
    max: 10,
    step: 0.1,
    unit: 's',
    fallback: 0,
    inherited: inherited('animationDelay', 0),
    help: 'Follows the delay under all animations.',
  },
]);

// Overriding starts from the inherited value, so the slider does not jump.
function override(key: string, value: RangeValue) {
  store.avatarStyleOptions[key] =
    typeof value === 'number' ? value : [...value];
}

const anythingSet = computed(() =>
  [switchKey.value, speedKey.value, delayKey.value].some((key) =>
    store.isOptionSet(key),
  ),
);

function resetAll() {
  for (const key of [switchKey.value, speedKey.value, delayKey.value]) {
    if (store.isOptionSet(key)) {
      store.resetOption(key);
    }
  }
}
</script>

<template>
  <div class="pg-animation-name">
    <div class="pg-field">
      <div class="pg-field-label">
        <span>Switch</span>
        <span class="pg-field-tools">
          <PlaygroundFieldReset v-if="anythingSet" @click="resetAll()" />
        </span>
      </div>
      <SiteSegmented
        v-model="choice"
        :options="choices"
        aria-label="Switch"
        fluid
      />
      <p class="pg-help">{{ status }}</p>
    </div>

    <div v-if="plays" class="pg-animation-name-pair">
      <template v-for="field in fields" :key="field.label">
        <PlaygroundRangeField
          v-if="store.isOptionSet(field.key)"
          :label="field.label"
          :option-key="field.key"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :unit="field.unit"
          :default-single="field.fallback"
        />
        <div v-else class="pg-field">
          <div class="pg-field-label">
            <span>{{ field.label }}</span>
            <span class="pg-field-tools">
              <span class="pg-field-value">
                {{ formatInherited(field.inherited, field.unit) }}
              </span>
              <button
                type="button"
                class="pg-field-action hv-ghost"
                @click="override(field.key, field.inherited)"
              >
                Override
              </button>
            </span>
          </div>
          <p class="pg-help">{{ field.help }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-animation-name {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pg-animation-name-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@container pg-options (max-width: 520px) {
  .pg-animation-name-pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
