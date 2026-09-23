<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus } from '@lucide/vue';
import SitePopover from '@theme/components/site/SitePopover.vue';
import SiteSlider from '@theme/components/site/SiteSlider.vue';
import { stripHash } from '@theme/utils/avatar/colors';

const props = defineProps<{
  presetColors: string[];
  colors: string[];
  // A row with a label instead of the square button.
  row?: boolean;
}>();

const emit = defineEmits<{
  add: [hex: string];
}>();

const popover = ref<InstanceType<typeof SitePopover>>();

// The picker opens on the style's first color, so a new color starts close
// to the palette. The native input takes six digits only.
const nativePickerColor = ref(
  `#${(props.presetColors[0] ?? 'b6e3f4').slice(0, 6)}`,
);
const pickerOpacity = ref(100);

const pickedHex = computed(() => {
  const hex = stripHash(nativePickerColor.value);

  if (pickerOpacity.value >= 100) return hex;

  const alpha = Math.round((pickerOpacity.value / 100) * 255)
    .toString(16)
    .padStart(2, '0');

  return `${hex}${alpha}`;
});

const alreadyAdded = computed(() =>
  props.colors.includes(pickedHex.value.toLowerCase()),
);

function toggle(event: Event) {
  popover.value?.toggle(event);
}

function addFromPicker() {
  emit('add', pickedHex.value);
  popover.value?.hide();
}
</script>

<template>
  <button
    v-if="row"
    type="button"
    class="pg-color-picker-row hv-link"
    @click="toggle"
  >
    <Plus :size="16" aria-hidden="true" />
    Add a color
  </button>
  <button
    v-else
    type="button"
    class="pg-color-picker-trigger hv-dashed"
    aria-label="Add a color"
    data-tip="Add a color"
    @click="toggle"
  >
    <Plus :size="18" aria-hidden="true" />
  </button>

  <SitePopover ref="popover" label="Add a color">
    <template #default="{ hide }">
      <div class="pg-picker">
        <div class="pg-picker-custom">
          <input
            v-model="nativePickerColor"
            type="color"
            aria-label="Color"
            class="pg-picker-native hv-border"
          />
          <span class="pg-picker-preview">
            <span :style="{ background: `#${pickedHex}` }"></span>
          </span>
          <span class="pg-picker-hex">#{{ pickedHex.toUpperCase() }}</span>
        </div>
        <div class="pg-field">
          <div class="pg-field-label">
            <span>Opacity</span>
            <span class="pg-field-tools">
              <span class="pg-field-value">{{ pickerOpacity }}%</span>
            </span>
          </div>
          <SiteSlider
            v-model="pickerOpacity"
            :min="0"
            :max="100"
            :step="1"
            aria-label="Opacity"
          />
        </div>
        <div class="pg-picker-actions">
          <button
            type="button"
            class="site-btn site-btn-primary site-btn-sm"
            :disabled="alreadyAdded"
            @click="addFromPicker"
          >
            Add color
          </button>
          <button
            type="button"
            class="site-btn site-btn-secondary site-btn-sm"
            @click="hide"
          >
            Cancel
          </button>
        </div>
      </div>
    </template>
  </SitePopover>
</template>

<style scoped lang="scss">
.pg-color-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--db-brand-text);
  cursor: pointer;
}

.pg-color-picker-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  box-sizing: border-box;
  border: 1px dashed var(--db-btn-border);
  border-radius: var(--db-radius-1);
  background: transparent;
  color: var(--db-muted);
  cursor: pointer;
}

.pg-picker {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 260px;
  max-width: 100%;
}

.pg-picker-custom {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pg-picker-native {
  flex-shrink: 0;
  width: 56px;
  height: 40px;
  padding: 3px;
  box-sizing: border-box;
  border: 1px solid var(--db-btn-border);
  border-radius: 10px;
  background: var(--db-paper);
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: var(--db-radius-1);
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: var(--db-radius-1);
  }
}

/* The checker shows through a color with reduced opacity. */
.pg-picker-preview {
  display: block;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid var(--db-line);
  border-radius: 10px;
  background: repeating-conic-gradient(
      var(--db-soft) 0% 25%,
      var(--db-paper) 0% 50%
    )
    50% / 10px 10px;

  > span {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.pg-picker-hex {
  font-family: var(--db-font-mono);
  font-size: 14px;
  line-height: 20px;
  color: var(--db-ink-2);
}

.pg-picker-actions {
  display: flex;
  gap: 8px;
}
</style>
