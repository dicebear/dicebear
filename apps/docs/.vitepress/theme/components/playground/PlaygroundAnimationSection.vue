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

// `false` and an empty list both mean "off", so an imported configuration
// carrying either leaves the toggle down. The speed rides along with the
// switch: it has no meaning on its own and would otherwise linger in the
// emitted options after the animations are turned off again.
function turnOff() {
  delete store.avatarStyleOptions[animationKey];
  delete store.avatarStyleOptions[speedKey];
}

// The reset next to the toggle clears the speed with it, for the same reason.
function resetAnimation() {
  store.resetOption(animationKey);

  if (store.isOptionSet(speedKey)) {
    store.resetOption(speedKey);
  }
}

const animation = computed({
  get: () => {
    const value = store.avatarStyleOptions[animationKey];

    if (value === undefined || value === false) {
      return false;
    }

    return !Array.isArray(value) || value.length > 0;
  },
  set: (val: boolean) => {
    if (val) {
      store.avatarStyleOptions[animationKey] = true;
    } else {
      turnOff();
    }
  },
});

// The current selection as a list of names. `true` means all of them.
const selectedNames = computed<string[]>(() => {
  const value = store.avatarStyleOptions[animationKey];

  if (value === true) {
    return props.names;
  }

  if (typeof value === 'string') {
    return [value];
  }

  return Array.isArray(value) ? (value as string[]) : [];
});

function isSelected(name: string): boolean {
  return selectedNames.value.includes(name);
}

// Writes the canonical option for a selection: every name checked collapses
// to `true`, none checked turns the toggle off (an empty list is not a valid
// option value), anything else is the list in descriptor order.
function toggleName(name: string, checked: boolean) {
  const next = props.names.filter((candidate) =>
    candidate === name ? checked : isSelected(candidate),
  );

  if (next.length === props.names.length) {
    store.avatarStyleOptions[animationKey] = true;
  } else if (next.length === 0) {
    turnOff();
  } else {
    store.avatarStyleOptions[animationKey] = next;
  }
}
</script>

<template>
  <div class="pg-animation">
    <div class="pg-field">
      <div class="pg-field-label pg-animation-toggle-row">
        <ToggleSwitch v-model="animation" />
        <span>Play animations</span>
        <PlaygroundFieldReset
          v-if="store.isOptionSet(animationKey)"
          @click="resetAnimation()"
        />
      </div>
      <p class="pg-help">
        Plays the style's built-in animations in the SVG output. Raster formats
        (PNG, JPEG, WebP, AVIF) always show the resting state, and viewers with
        a reduced motion preference see the avatar still.
      </p>
    </div>

    <div v-if="animation && names.length > 0" class="pg-field">
      <div class="pg-field-label">
        <span>Animations</span>
      </div>
      <div class="pg-animation-names">
        <label v-for="name in names" :key="name" class="pg-animation-name">
          <Checkbox
            :model-value="isSelected(name)"
            :binary="true"
            @update:model-value="
              (checked: boolean) => toggleName(name, checked)
            "
          />
          <span>{{ name }}</span>
        </label>
      </div>
      <p class="pg-help">
        Pick which of the style's animations play. Unchecking all of them turns
        animations off.
      </p>
    </div>

    <PlaygroundRangeField
      v-if="animation"
      label="Speed"
      option-key="animationSpeed"
      :min="0.1"
      :max="10"
      :step="0.05"
      unit="×"
      :default-single="1"
    />
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
