<script setup lang="ts">
/**
 * The style as the title of the playground: its picture, its name as large
 * as a heading and, under it, who drew it and its license. A press opens the
 * list of styles right under it, aligned to its left edge, on a phone as a
 * sheet from the bottom.
 */
import { computed, ref } from 'vue';
import { capitalCase } from 'change-case';
import { storeToRefs } from 'pinia';
import { useData } from 'vitepress';
import { useMediaQuery } from '@vueuse/core';
import { ChevronDown } from '@lucide/vue';
import { exampleSeeds } from '@theme/config/styleCategories';
import type { ThemeOptions } from '@theme/types';
import { formatLicenseName } from '@theme/utils/format';
import useStore from '@theme/stores/playground';
import { usePlaygroundStyles } from '@theme/composables/usePlaygroundStyles';
import SiteDialog from '../site/SiteDialog.vue';
import SitePopover from '../site/SitePopover.vue';
import PlaygroundStylePicker from './PlaygroundStylePicker.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';

defineOptions({ inheritAttrs: false });

const { theme } = useData<ThemeOptions>();
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

// Who drew the style and under which license, the line under its name.
const credit = computed(() => {
  if (store.isCustomStyle) return 'Your own style';

  const meta = theme.value.avatarStyles[avatarStyleName.value]?.meta;
  const license = formatLicenseName(meta?.license?.name);

  return [meta?.creator, license].filter(Boolean).join(' · ');
});

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
    <span class="pg-style-field-text">
      <span class="sr-only">Style:</span>
      <span class="pg-style-field-title">
        <span class="pg-style-field-name">{{ currentName }}</span>
        <ChevronDown
          :size="24"
          :stroke-width="2.4"
          aria-hidden="true"
          class="pg-style-field-chevron"
        />
      </span>
      <span v-if="credit" class="pg-style-field-credit">{{ credit }}</span>
    </span>
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
/* The title of the playground: the picture, the name of the style as large
   as a heading with the chevron after it, and the credit under it. It is a
   button to choose with, so it stands on the tint of a picker, stronger on
   hover and while the list is open. */
.pg-style-field {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  max-width: 100%;
  padding: 6px 20px 6px 6px;
  border: 0;
  border-radius: 22px;
  background: color-mix(in srgb, var(--db-ink) 7%, transparent);
  font: inherit;
  color: var(--db-ink);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s;

  &:hover,
  &[aria-expanded='true'] {
    background: color-mix(in srgb, var(--db-ink) 12%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--db-focus);
    outline-offset: 2px;
  }

  &-thumb {
    flex-shrink: 0;
    display: block;
    width: 52px;
    height: 52px;

    :deep(.pg-thumb) {
      border-radius: 16px;
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &-title {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  &-name {
    font-family: var(--db-font-display);
    font-size: 32px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-chevron {
    flex-shrink: 0;
    transition: transform 0.15s;
  }

  &[aria-expanded='true'] &-chevron {
    transform: rotate(180deg);
  }

  &-credit {
    font-size: 14px;
    line-height: 18px;
    color: var(--db-ink-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Smaller in a phone's app bar, a pill as high as its neighbours; the
     credit stays on the style's own page. */
  @media (max-width: 767px) {
    gap: 8px;
    height: 44px;
    padding: 0 12px 0 4px;
    border-radius: 22px;

    /* Round in the round pill, with the same room on every side. */
    &-thumb {
      width: 36px;
      height: 36px;

      :deep(.pg-thumb) {
        border-radius: 50%;
      }
    }

    &-name {
      font-size: 18px;
    }

    &-chevron {
      width: 16px;
      height: 16px;
    }

    &-credit {
      display: none;
    }

    /* The narrowest phones keep the name, the avatar is on the stage. */
    @media (max-width: 359px) {
      padding-left: 12px;

      &-thumb {
        display: none;
      }
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
