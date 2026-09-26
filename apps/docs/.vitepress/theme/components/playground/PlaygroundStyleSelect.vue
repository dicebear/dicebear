<script setup lang="ts">
/**
 * The style field in the toolbar. It opens the list of styles right under
 * it, aligned to its left edge, on a phone as a sheet from the bottom.
 */
import { computed, ref } from 'vue';
import { capitalCase } from 'change-case';
import { storeToRefs } from 'pinia';
import { useMediaQuery } from '@vueuse/core';
import { ChevronDown } from '@lucide/vue';
import { exampleSeeds } from '@theme/config/styleCategories';
import useStore from '@theme/stores/playground';
import { usePlaygroundStyles } from '@theme/composables/usePlaygroundStyles';
import SiteDialog from '../site/SiteDialog.vue';
import SitePopover from '../site/SitePopover.vue';
import PlaygroundStylePicker from './PlaygroundStylePicker.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';

defineOptions({ inheritAttrs: false });

const store = useStore();
const { avatarStyleName } = storeToRefs(store);
const { chooseStyle, openUpload } = usePlaygroundStyles();

const phone = useMediaQuery('(max-width: 767px)');
const trigger = ref<HTMLButtonElement | null>(null);
const popover = ref<InstanceType<typeof SitePopover> | null>(null);
const popoverOpen = ref(false);
const picker = ref<InstanceType<typeof PlaygroundStylePicker> | null>(null);

// The search takes the focus once the list is visible. The sheet on a phone
// leaves it, so the keyboard does not cover the list.
function onShow() {
  popoverOpen.value = true;
  picker.value?.focus();
}
const sheetOpen = ref(false);

function onTrigger(event: MouseEvent) {
  if (phone.value) {
    sheetOpen.value = true;

    return;
  }

  popover.value?.toggle(event);
}

function close() {
  popover.value?.hide();
  sheetOpen.value = false;
}

function pick(name: string) {
  chooseStyle(name);
  close();
  trigger.value?.focus();
}

function upload() {
  close();
  openUpload();
}

// Esc or a press outside closes the list. A focus left in the list goes
// back to the field, a press on something else keeps its own.
function onHide() {
  popoverOpen.value = false;

  requestAnimationFrame(() => {
    const focused = document.activeElement;

    if (!focused || focused === document.body) trigger.value?.focus();
  });
}

const currentName = computed(() =>
  store.isCustomStyle
    ? (store.customStyles[avatarStyleName.value]?.name ?? 'Custom Style')
    : capitalCase(avatarStyleName.value),
);

const triggerOptions = { seed: exampleSeeds[0] };
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="pg-style-field"
    v-bind="$attrs"
    aria-haspopup="dialog"
    :aria-expanded="popoverOpen || sheetOpen"
    @click="onTrigger"
  >
    <span class="pg-style-field-thumb">
      <PlaygroundThumb
        :style-name="avatarStyleName"
        :options="triggerOptions"
        surface="tile"
      />
    </span>
    <span class="pg-style-field-name">{{ currentName }}</span>
    <ChevronDown :size="16" aria-hidden="true" class="pg-style-field-chevron" />
  </button>

  <SitePopover
    ref="popover"
    align="left"
    bare
    label="Avatar styles"
    class="pg-style-popover"
    @show="onShow"
    @hide="onHide"
  >
    <PlaygroundStylePicker ref="picker" @pick="pick" @upload="upload" />
  </SitePopover>

  <SiteDialog
    v-if="phone"
    v-model:open="sheetOpen"
    sheet
    header="Avatar style"
    content-class="pg-style-sheet"
  >
    <PlaygroundStylePicker @pick="pick" @upload="upload" />
  </SiteDialog>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

/* The field in the toolbar: the picture and the name of the style. */
.pg-style-field {
  @include c.control;
  @include c.control-size(md);

  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 0 10px 0 5px;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
  }

  &-thumb {
    flex-shrink: 0;
    display: block;
    width: 28px;
    height: 28px;

    :deep(.pg-thumb) {
      border-radius: var(--db-radius-1);
    }
  }

  &-name {
    font-size: 15px;
    line-height: 20px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--db-muted);
    transition: transform 0.15s;
  }

  &[aria-expanded='true'] {
    border-color: var(--db-brand);

    .pg-style-field-chevron {
      transform: rotate(180deg);
    }
  }
}

/* The list hangs under the field. It keeps one height while the search
   narrows it, so the panel does not jump. No display of its own here: the
   closed popover hides through the browser's display rule. */
.pg-style-popover {
  width: 440px;
  height: min(620px, calc(100vh - 150px));
}
</style>
