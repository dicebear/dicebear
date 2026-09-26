<script setup lang="ts">
/**
 * The view of the playground, as a button that opens a menu. Each entry
 * draws the view's layout and says who it is for: the editor for a person
 * designing their own avatar, Simple and Advanced for developers who set up
 * avatars from seeds. A menu rather than a row of segments works on touch
 * and fits the phone's bar. On a phone the button keeps only the drawing.
 */
import { computed, nextTick, ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { Check, ChevronDown } from '@lucide/vue';
import useStore, { type PlaygroundMode } from '@theme/stores/playground';
import SitePopover from '../site/SitePopover.vue';
import PlaygroundModeSketch from './PlaygroundModeSketch.vue';

defineOptions({ inheritAttrs: false });

const store = useStore();
const compact = useMediaQuery('(max-width: 767px)');

const MODES: { value: PlaygroundMode; label: string; description: string }[] = [
  {
    value: 'editor',
    label: 'Editor',
    description:
      'Design your own avatar. Pick each part and color from the tiles, then download it.',
  },
  {
    value: 'simple',
    label: 'Simple',
    description:
      'Set up avatars for your app. Each seed, such as a user name, always gets the same avatar. Start from a finished look.',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description:
      'The same seed-based avatars with every option of the style: probabilities, weights, color lists and animation.',
  },
];

const current = computed(
  () => MODES.find((mode) => mode.value === store.mode) ?? MODES[1],
);

const trigger = ref<HTMLButtonElement | null>(null);
const popover = ref<InstanceType<typeof SitePopover> | null>(null);
const items = ref<HTMLButtonElement[]>([]);
const open = ref(false);

function onTrigger(event: MouseEvent) {
  popover.value?.toggle(event);
}

// The chosen view takes the focus, so the arrow keys start from it.
async function onShow() {
  open.value = true;

  await nextTick();

  items.value
    .find((item) => item.dataset.mode === current.value.value)
    ?.focus();
}

// A focus left in the menu goes back to the button.
function onHide() {
  open.value = false;

  requestAnimationFrame(() => {
    const focused = document.activeElement;

    if (!focused || focused === document.body) trigger.value?.focus();
  });
}

function pick(mode: PlaygroundMode) {
  store.setMode(mode, 'menu');
  popover.value?.hide();
  trigger.value?.focus();
}

function onKeydown(event: KeyboardEvent, index: number) {
  const last = MODES.length - 1;
  let target: number;

  switch (event.key) {
    case 'ArrowDown':
      target = index === last ? 0 : index + 1;
      break;
    case 'ArrowUp':
      target = index === 0 ? last : index - 1;
      break;
    case 'Home':
      target = 0;
      break;
    case 'End':
      target = last;
      break;
    default:
      return;
  }

  event.preventDefault();
  items.value.find((item) => Number(item.dataset.index) === target)?.focus();
}
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="pg-mode-field"
    :class="{ 'is-compact': compact }"
    v-bind="$attrs"
    :aria-label="compact ? `View: ${current.label}` : undefined"
    aria-haspopup="menu"
    :aria-expanded="open"
    @click="onTrigger"
  >
    <PlaygroundModeSketch :mode="current.value" class="pg-mode-field-sketch" />
    <template v-if="!compact">
      <span class="pg-mode-field-label">View</span>
      <span class="pg-mode-field-name">{{ current.label }}</span>
    </template>
    <ChevronDown :size="16" aria-hidden="true" class="pg-mode-field-chevron" />
  </button>

  <SitePopover
    ref="popover"
    align="right"
    bare
    label="View"
    @show="onShow"
    @hide="onHide"
  >
    <div class="pg-mode-menu" role="menu" aria-label="View">
      <button
        v-for="(mode, index) in MODES"
        :key="mode.value"
        ref="items"
        type="button"
        role="menuitemradio"
        class="pg-mode-item"
        :aria-checked="mode.value === current.value"
        :data-mode="mode.value"
        :data-index="index"
        @click="pick(mode.value)"
        @keydown="onKeydown($event, index)"
      >
        <PlaygroundModeSketch
          :mode="mode.value"
          :active="mode.value === current.value"
          class="pg-mode-item-sketch"
        />
        <span class="pg-mode-item-text">
          <span class="pg-mode-item-name">{{ mode.label }}</span>
          <span class="pg-mode-item-description">{{ mode.description }}</span>
        </span>
        <Check
          v-if="mode.value === current.value"
          :size="16"
          aria-hidden="true"
          class="pg-mode-item-check"
        />
      </button>
    </div>
  </SitePopover>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

/* A field of the control set, like the style field on the other end of the
   bar: the drawing of the view, the word View and its name. */
.pg-mode-field {
  @include c.control;
  @include c.control-size(md);

  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 0 6px;
  font-weight: 600;
  color: var(--db-ink);
  cursor: pointer;

  &-sketch {
    width: 36px;
    height: 24px;
  }

  &-label {
    font-weight: 500;
    color: var(--db-muted);
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--db-muted);
  }

  &[aria-expanded='true'] &-chevron {
    transform: rotate(180deg);
  }

  &.is-compact {
    gap: 6px;
    padding: 0 8px 0 6px;
  }
}

/* As wide as the column under the button, and across the screen on a
   phone, with the same room on both sides. */
.pg-mode-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  width: 336px;
  padding: 6px;

  @media (max-width: 767px) {
    width: calc(100vw - 16px);
  }
}

.pg-mode-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: var(--db-radius-2);
  background: transparent;
  font: inherit;
  color: var(--db-ink);
  text-align: left;
  cursor: pointer;

  &:hover {
    background: var(--db-soft);
  }

  &[aria-checked='true'] {
    background: var(--db-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: -2px;
  }

  &-sketch {
    width: 72px;
    height: 48px;
  }

  &-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &-name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  &-description {
    font-size: 13px;
    line-height: 18px;
    color: var(--db-ink-2);
  }

  &-check {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--db-brand);
  }
}
</style>
