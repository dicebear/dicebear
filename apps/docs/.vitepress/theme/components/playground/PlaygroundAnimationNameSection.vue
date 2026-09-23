<script setup lang="ts">
/**
 * One named animation as a row: its name, whether it plays, and the switch
 * that lets it follow the global one or go its own way. While it plays, its
 * own speed and delay sit under the row.
 */
import { computed } from 'vue';
import SiteSegmented from '@theme/components/site/SiteSegmented.vue';
import { capitalCase } from 'change-case';
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
// "Play animations". `on` and `off` write the option and win over it.
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

// What the row says next to the name: the state the core resolves, and
// "own" when the animation's own switch decides it.
const state = computed(() => {
  const word = plays.value ? 'plays' : 'still';

  return choice.value === 'follow' ? word : `${word} · own`;
});

// The value an unset field inherits: the option under "Play animations" as
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
  <div class="pg-anim-row">
    <div class="pg-anim-row-head">
      <span class="pg-anim-row-name">{{ capitalCase(name) }}</span>
      <span class="pg-anim-row-state">{{ state }}</span>
      <PlaygroundFieldReset v-if="anythingSet" @click="resetAll()" />
      <SiteSegmented
        v-model="choice"
        :options="choices"
        size="sm"
        :aria-label="`${capitalCase(name)} switch`"
        class="pg-anim-row-switch"
      />
    </div>

    <div v-if="plays" class="pg-fields pg-anim-row-fields">
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
                class="site-btn site-btn-ghost site-btn-sm"
                @click="override(field.key, field.inherited)"
              >
                Own
              </button>
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-anim-row {
  padding: 12px 0;
  border-top: 1px solid var(--db-line);
}

.pg-anim-row-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 30px;
}

.pg-anim-row-name {
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: var(--db-ink);
}

.pg-anim-row-state {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--db-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pg-anim-row-switch {
  flex-shrink: 0;
  grid-auto-columns: auto;
}

.pg-anim-row-fields {
  margin-top: 10px;
}

/* A narrow column stacks the switch under the name. */
@container pg-options (max-width: 300px) {
  .pg-anim-row-head {
    flex-wrap: wrap;
  }

  .pg-anim-row-switch {
    width: 100%;
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
  }
}
</style>
