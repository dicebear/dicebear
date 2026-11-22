<script setup lang="ts">
/**
 * A row of tab pills. As many as fit stand in the row; the rest go into a
 * last pill that opens a menu (SiteMenu). The pill takes the name of a tab
 * chosen from the menu and fills like any chosen tab. Nothing scrolls
 * sideways, so every tab can be reached with a mouse wheel, a touchpad, a
 * keyboard or a finger alike. The arrow keys move between the tabs in the
 * row and pass over disabled ones; the menu holds the rest.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { ChevronDown } from '@lucide/vue';
import SiteMenu, { type SiteMenuItem } from './SiteMenu.vue';

export interface SiteTab {
  id: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    tabs: SiteTab[];
    ariaLabel?: string;
    moreLabel?: string;
  }>(),
  { ariaLabel: undefined, moreLabel: 'More' },
);

const model = defineModel<string>({ required: true });

const root = ref<HTMLElement>();
const measure = ref<HTMLElement>();
const visible = ref(props.tabs.length);

const GAP = 4;
/** Room for the chevron of the last pill. */
const CHEVRON = 26;

const shown = computed(() => props.tabs.slice(0, visible.value));
const hidden = computed(() => props.tabs.slice(visible.value));
const hiddenActive = computed(() =>
  hidden.value.find((tab) => tab.id === model.value),
);

const menu = computed<SiteMenuItem[]>(() =>
  hidden.value.map((tab) => ({
    label: tab.label,
    checked: tab.id === model.value,
    disabled: tab.disabled,
    command: () => {
      model.value = tab.id;
    },
  })),
);

const buttons = ref<HTMLButtonElement[]>([]);

/** The one tab in the row that Tab reaches: the chosen one, or the first. */
const tabStop = computed(() => {
  const chosen = shown.value.findIndex((tab) => tab.id === model.value);

  return chosen >= 0 ? chosen : shown.value.findIndex((tab) => !tab.disabled);
});

function onKeydown(event: KeyboardEvent, index: number) {
  const open = shown.value.flatMap((tab, i) => (tab.disabled ? [] : [i]));
  const position = open.indexOf(index);
  const last = open.length - 1;
  const target = {
    ArrowRight: open[position >= last ? 0 : position + 1],
    ArrowLeft: open[position <= 0 ? last : position - 1],
    Home: open[0],
    End: open[last],
  }[event.key];

  if (target === undefined) return;

  event.preventDefault();
  model.value = shown.value[target].id;
  buttons.value
    .find((button) => Number(button.dataset.index) === target)
    ?.focus();
}

function fit() {
  const box = root.value;
  const pills = measure.value
    ? Array.from(measure.value.children as HTMLCollectionOf<HTMLElement>)
    : [];

  if (!box || pills.length !== props.tabs.length) {
    return;
  }

  const widths = pills.map((pill) => pill.offsetWidth);
  const available = box.clientWidth;
  const total = widths.reduce((sum, width) => sum + width + GAP, -GAP);

  if (total <= available) {
    visible.value = props.tabs.length;

    return;
  }

  // The last pill may show the longest hidden label, so it gets that room.
  const more = Math.max(...widths) + CHEVRON;
  let used = more;
  let count = 0;

  while (count < widths.length && used + widths[count] + GAP <= available) {
    used += widths[count] + GAP;
    count += 1;
  }

  visible.value = count;
}

let observer: ResizeObserver | undefined;

onMounted(() => {
  observer = new ResizeObserver(() => fit());

  if (root.value) {
    observer.observe(root.value);
  }

  // The display face may arrive after the first layout.
  void document.fonts?.ready.then(() => fit());
  fit();
});

onBeforeUnmount(() => observer?.disconnect());

watch(
  () => props.tabs.map((tab) => tab.label).join('|'),
  () => void nextTick(fit),
);
</script>

<template>
  <div ref="root" class="site-tabs">
    <div class="site-tabs-list" role="tablist" :aria-label="ariaLabel">
      <button
        v-for="(tab, index) in shown"
        :key="tab.id"
        ref="buttons"
        type="button"
        role="tab"
        class="site-pill site-pill-tab"
        :aria-selected="tab.id === model"
        :tabindex="index === tabStop ? 0 : -1"
        :disabled="tab.disabled"
        :data-index="index"
        @click="model = tab.id"
        @keydown="onKeydown($event, index)"
      >
        {{ tab.label }}
      </button>
      <SiteMenu
        v-if="hidden.length"
        :items="menu"
        :label="moreLabel"
        align="right"
        class="site-tabs-more"
      >
        <template #trigger="{ open, toggle }">
          <button
            type="button"
            class="site-pill site-pill-tab"
            :class="{ 'is-active': hiddenActive }"
            :aria-expanded="open"
            aria-haspopup="menu"
            @click="toggle"
          >
            {{ hiddenActive?.label ?? moreLabel }}
            <ChevronDown
              :size="16"
              aria-hidden="true"
              class="site-tabs-chevron"
            />
          </button>
        </template>
      </SiteMenu>
    </div>
    <div ref="measure" class="site-tabs-measure" aria-hidden="true">
      <span
        v-for="tab in tabs"
        :key="tab.id"
        class="site-pill site-pill-tab"
        aria-selected="true"
        >{{ tab.label }}</span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-tabs {
  position: relative;
  flex: 1;
  min-width: 0;
}

.site-tabs-list {
  display: flex;
  gap: 4px;
  overflow: hidden;

  > .site-pill {
    flex-shrink: 0;
  }
}

/* The last pill: soft while its menu is open, its chevron turned. */
.site-tabs-more {
  flex-shrink: 0;

  [aria-expanded='true']:not(.is-active) {
    background: var(--db-soft);
    color: var(--db-ink);
  }
}

.site-tabs-chevron {
  transition: transform 0.2s var(--ease-smooth);

  [aria-expanded='true'] > & {
    transform: rotate(180deg);
  }
}

/* Every tab once, at its bold width, to know what fits. The row itself
   has no size, so it never widens the page; the pills keep theirs. */
.site-tabs-measure {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 0;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;

  > * {
    flex-shrink: 0;
  }
}
</style>
