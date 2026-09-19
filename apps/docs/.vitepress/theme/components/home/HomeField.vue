<script setup lang="ts">
/**
 * The interactive part of the hero: a tilted field of avatar tiles in many
 * styles and, on top of it, the seed box. The tiles keep fixed seeds and come
 * from the HTTP API. Only the avatar in the seed box follows the seed. The
 * library draws it in the browser from the selected style, so typing sends
 * no API requests. Until someone types, the box cycles through a few names by
 * itself.
 *
 * The server renders the empty tiles and the first name. The avatars follow
 * after mount.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { useData, withBase } from 'vitepress';
import {
  useDebounceFn,
  useIntersectionObserver,
  useResizeObserver,
} from '@vueuse/core';
import { Avatar, type Style } from '@dicebear/core';
import { ArrowRight, ChevronDown } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { normalizeLicense } from '@theme/config/styleCategories';
import { getPreviewRowSeeds } from '@theme/config/previewRowSeeds';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle } from '@theme/utils/avatar/style';
import { styleDisplayName } from '@theme/utils/styleMeta';
import { track } from '@theme/utils/track';
import HomeStylePicker from './HomeStylePicker.vue';

const { theme } = useData<ThemeOptions>();

const COLUMNS = 14;
const ROWS = 6;
const DEFAULT_STYLE = 'lorelei';

/** The names the field types while nobody else does. */
const NAMES = ['Iris', 'Leon', 'Cara', 'Finn'];

const TYPE_MS = 240;
const ERASE_MS = 90;
const HOLD_MS = 1700;

/**
 * The styles of the field. Abstract styles sit at the even places and
 * characters at the odd ones, which the tile pattern below turns into a
 * checkerboard.
 */
const FIELD_STYLES = [
  'glass',
  'cats',
  'shapes',
  'lorelei',
  'rings',
  'cameo',
  'waves',
  'notionists',
  'squircles',
  'critters',
  'loops',
  'voxel-art',
  'blobs',
  'dogs',
  'slice',
  'shadows',
  'initials',
  'clay',
  'triangles',
  'marbles',
  'stack',
  'line-face',
  'identicon',
  'notionists-neutral',
];

/** The styles the picker offers, characters first. */
const PICKER_STYLES = [
  'lorelei',
  'notionists',
  'open-peeps',
  'cats',
  'dogs',
  'thumbs',
  'pixel-art',
  'cameo',
  'shapes',
  'glass',
  'rings',
  'initials',
  'identicon',
  'loops',
  'squircles',
  'stack',
];

/** The hero only shows styles anyone may use without attribution. */
function isCc0(name: string): boolean {
  const license = theme.value.avatarStyles[name]?.meta.license?.name;

  return license !== undefined && normalizeLicense(license) === 'CC0 1.0';
}

const fieldStyles = FIELD_STYLES.filter(isCc0);
const pickerStyles = PICKER_STYLES.filter(isCc0).map((name) => ({
  name,
  title: styleDisplayName(name),
}));

/**
 * One entry per tile. The strides 5 and 11 keep equal styles at least three
 * tiles apart. A style that comes up again takes the next seed of its preview
 * row, so its tiles differ.
 */
const tiles = (() => {
  const seen: Record<string, number> = {};
  const list: { key: number; src: string }[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const styleName =
        fieldStyles[(column * 5 + row * 11) % fieldStyles.length];
      const seeds = getPreviewRowSeeds(styleName);
      const count = seen[styleName] ?? 0;

      seen[styleName] = count + 1;
      list.push({
        key: list.length,
        src: getAvatarApiUrl(styleName, { seed: seeds[count % seeds.length] }),
      });
    }
  }

  return list;
})();

const text = ref(NAMES[0]);
const seed = ref(NAMES[0]);
const styleName = ref(DEFAULT_STYLE);
const pickerOpen = ref(false);

const styleTitle = computed(() => styleDisplayName(styleName.value));
const playgroundUrl = computed(() =>
  withBase(`/playground/?style=${styleName.value}`),
);
const stylesUrl = withBase('/styles/');

/* Rendering */

const styles = shallowRef<Record<string, Style>>({});
const requested = new Set<string>();

function load(names: string[]) {
  for (const name of names) {
    if (requested.has(name)) {
      continue;
    }

    requested.add(name);

    loadAvatarStyle(name)
      .then((style) => {
        styles.value = { ...styles.value, [name]: style };
      })
      .catch((e) => {
        if (import.meta.env.DEV) {
          console.warn('Avatar style failed to load:', e);
        }
      });
  }
}

/**
 * The selected style is drawn here once its definition has arrived. Every
 * other avatar, and the selected one until then, comes from the API.
 */
function render(name: string, avatarSeed: string): string {
  const style = name === styleName.value ? styles.value[name] : undefined;

  return style
    ? new Avatar(style, { seed: avatarSeed }).toDataUri()
    : getAvatarApiUrl(name, { seed: avatarSeed });
}

/** Which tiles reach into the stage. The tilt pushes many of them outside. */
const inView = ref<boolean[]>([]);
const stage = ref<HTMLElement>();
const grid = ref<HTMLElement>();

function measure() {
  if (!stage.value || !grid.value) {
    return;
  }

  const frame = stage.value.getBoundingClientRect();

  inView.value = Array.from(grid.value.children, (tile) => {
    const box = tile.getBoundingClientRect();

    return (
      box.bottom > frame.top &&
      box.top < frame.bottom &&
      box.right > frame.left &&
      box.left < frame.right
    );
  });
}

useResizeObserver(stage, measure);

const faceSource = computed(() => render(styleName.value, seed.value));

const pickerSources = computed(() =>
  pickerOpen.value
    ? Object.fromEntries(
        pickerStyles.map(({ name }) => [name, render(name, seed.value)]),
      )
    : {},
);

/* The names that type themselves */

const typing = ref(false);
const stageVisible = ref(true);
let userTookOver = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let nameIndex = 0;

function step(erasing: boolean) {
  if (userTookOver) {
    return;
  }

  if (!stageVisible.value) {
    timer = setTimeout(() => step(erasing), HOLD_MS);
    return;
  }

  if (erasing) {
    if (text.value.length > 0) {
      text.value = text.value.slice(0, -1);
      timer = setTimeout(() => step(true), ERASE_MS);
      return;
    }

    nameIndex = (nameIndex + 1) % NAMES.length;
  }

  const name = NAMES[nameIndex];

  if (text.value.length < name.length) {
    text.value = name.slice(0, text.value.length + 1);
    timer = setTimeout(() => step(false), TYPE_MS);
    return;
  }

  // The avatars only change once the name is complete.
  seed.value = name;
  timer = setTimeout(() => step(true), HOLD_MS);
}

function stopTyping() {
  userTookOver = true;
  typing.value = false;
  clearTimeout(timer);
}

function onFocus() {
  if (!typing.value) {
    return;
  }

  // Focus can land while a name is half typed or half erased.
  stopTyping();
  text.value = seed.value;
}

// The seed text never leaves the browser, only the fact that someone typed.
const trackSeedEdited = useDebounceFn(() => {
  track('Home Demo: Seed Edited', { style: styleName.value });
}, 700);

function onInput(event: Event) {
  stopTyping();
  text.value = (event.target as HTMLInputElement).value;
  seed.value = text.value;
  trackSeedEdited();
}

/* The style picker */

const toggle = ref<HTMLButtonElement>();

function togglePicker() {
  // The picker shows the current seed, so the names stop typing themselves
  // while it is open.
  if (!pickerOpen.value && typing.value) {
    stopTyping();
    text.value = seed.value;
  }

  pickerOpen.value = !pickerOpen.value;
}

// A new seed closes the picker, which would otherwise request every one of
// its avatars again on each keystroke.
watch(seed, () => {
  pickerOpen.value = false;
});

function pick(name: string) {
  styleName.value = name;
  pickerOpen.value = false;
  load([name]);
  track('Home Demo: Style Selected', { style: name });
  void nextTick(() => toggle.value?.focus());
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && pickerOpen.value) {
    pickerOpen.value = false;
    toggle.value?.focus();
  }
}

// The open picker makes the box taller, which can bring more tiles in reach.
watch(pickerOpen, () => nextTick(measure));

useIntersectionObserver(stage, ([entry]) => {
  stageVisible.value = entry?.isIntersecting ?? true;
});

onMounted(() => {
  measure();
  load([styleName.value]);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typing.value = true;
    timer = setTimeout(() => step(true), HOLD_MS);
  }
});

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div ref="stage" class="home-field">
    <div ref="grid" class="home-field-grid" aria-hidden="true">
      <span
        v-for="(tile, index) in tiles"
        :key="tile.key"
        class="home-field-tile"
      >
        <img v-if="inView[index]" :src="tile.src" alt="" decoding="async" />
      </span>
    </div>
    <span
      v-for="edge in ['top', 'left', 'right', 'bottom']"
      :key="edge"
      class="home-field-fade"
      :class="`home-field-fade-${edge}`"
    />

    <div
      class="home-field-box"
      :class="{ 'is-open': pickerOpen }"
      @keydown="onKeydown"
    >
      <div class="home-field-row">
        <button
          ref="toggle"
          type="button"
          class="home-field-face"
          aria-controls="home-style-picker"
          :aria-expanded="pickerOpen"
          :aria-label="`Change the style, now ${styleTitle}`"
          @click="togglePicker"
        >
          <span class="home-field-face-tile">
            <img
              v-if="faceSource"
              :src="faceSource"
              :alt="`${styleTitle} avatar for the seed ${seed}`"
            />
          </span>
          <span class="home-field-face-badge">
            <ChevronDown :size="16" :stroke-width="2.25" aria-hidden="true" />
          </span>
        </button>

        <span class="home-field-seed">
          <label for="home-field-seed" class="home-field-label">Seed</label>
          <span class="home-field-input">
            <input
              id="home-field-seed"
              :value="text"
              type="text"
              maxlength="32"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              @focus="onFocus"
              @input="onInput"
            />
            <span v-if="typing" class="home-field-caret" aria-hidden="true">{{
              text
            }}</span>
          </span>
        </span>

        <a
          :href="playgroundUrl"
          class="home-field-open hv-ghost"
          aria-label="Open in the Playground"
          data-tip="Open in Playground"
        >
          <ArrowRight :size="32" :stroke-width="1.75" aria-hidden="true" />
        </a>
      </div>

      <div
        class="home-field-panel"
        :class="{ 'is-open': pickerOpen }"
        :inert="pickerOpen ? undefined : true"
        @transitionend="measure"
      >
        <div class="home-field-panel-inner">
          <HomeStylePicker
            id="home-style-picker"
            :styles="pickerStyles"
            :selected="styleName"
            :sources="pickerSources"
            :seed="seed"
            :all-styles-url="stylesUrl"
            :style-count="theme.styleCount"
            @pick="pick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-field {
  --home-tile: 150px;
  --home-gap: 24px;
  --home-columns: 14;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  --home-row: calc(var(--home-tile) + var(--home-gap));

  // Ends where the last row ends. A shorter field would cut that row into a
  // strip along the bottom edge.
  min-height: 990px;
  // The field is the background of the hero. The text block above it fills
  // the first screen, so pulling the field up by half of it starts the
  // avatars in the middle of that screen.
  margin-top: -40vh;
  margin-top: -40dvh;
  padding: calc(150px + var(--home-row)) var(--db-gutter) 120px;
  box-sizing: border-box;
  overflow: hidden;

  &-grid {
    --home-width: calc(
      var(--home-columns) * var(--home-tile) + (var(--home-columns) - 1) *
        var(--home-gap)
    );

    position: absolute;
    top: 0;
    left: 50%;
    display: grid;
    grid-template-columns: repeat(var(--home-columns), var(--home-tile));
    gap: var(--home-gap);
    width: var(--home-width);
    margin-left: calc(var(--home-width) / -2);
    transform: perspective(2000px) rotateX(56deg);
    transform-origin: 50% 0%;
  }

  &-tile {
    display: block;
    width: var(--home-tile);
    height: var(--home-tile);
    border-radius: 40px;
    overflow: hidden;
    background: var(--db-tile);

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-fade {
    position: absolute;
    pointer-events: none;

    &-top {
      inset: 0 0 auto;
      height: 560px;
      // Four stops instead of two, so the far rows stay pale for longer and
      // only gain weight near the end of the run.
      background: linear-gradient(
        180deg,
        var(--db-paper) 6%,
        color-mix(in srgb, var(--db-paper) 86%, transparent) 30%,
        color-mix(in srgb, var(--db-paper) 55%, transparent) 58%,
        transparent
      );
    }

    &-left {
      inset: 0 auto 0 0;
      width: 160px;
      background: linear-gradient(90deg, var(--db-paper), transparent);
    }

    &-right {
      inset: 0 0 0 auto;
      width: 160px;
      background: linear-gradient(270deg, var(--db-paper), transparent);
    }

    &-bottom {
      inset: auto 0 0;
      height: 280px;
      background: linear-gradient(0deg, var(--db-paper), transparent);
    }
  }

  // Anchored by its middle a little below the center of the field, so the
  // panel below pushes the box open upwards and downwards in equal parts.
  &-box {
    position: absolute;
    left: var(--db-gutter);
    right: var(--db-gutter);
    top: calc(50% + 50px);
    z-index: 2;
    width: auto;
    max-width: 820px;
    margin: 0 auto;
    padding: 20px;
    transform: translateY(-50%);
    box-sizing: border-box;
    border: 1px solid var(--db-line);
    border-radius: 72px;
    background: var(--db-panel);
    box-shadow: 0 32px 64px -48px rgba(11, 22, 32, 0.45);
    text-align: left;

    &.is-open {
      border-radius: 72px 72px 48px 48px;
    }
  }

  // The panel opens on its row height, which the box turns into growth in
  // both directions.
  &-panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--duration-mid) var(--ease-smooth);

    &.is-open {
      grid-template-rows: 1fr;
    }

    &-inner {
      overflow: hidden;
    }
  }

  &-row {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 104px;
  }

  &-face {
    position: relative;
    display: block;
    flex-shrink: 0;
    width: 104px;
    height: 104px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;

    &-tile {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      overflow: hidden;
      background: var(--db-tile);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    &-badge {
      position: absolute;
      right: -2px;
      bottom: -2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      box-sizing: border-box;
      border: 1px solid var(--db-line);
      border-radius: 50%;
      background: var(--db-panel);
      color: var(--db-ink);
      box-shadow: 0 2px 6px rgba(11, 22, 32, 0.18);
      transition: border-color var(--duration-fast);
    }

    &:hover &-badge {
      border-color: var(--db-hover-border);
    }
  }

  &-seed {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &-label {
    align-self: flex-start;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--db-muted);
  }

  &-input {
    position: relative;
    display: block;
    height: 72px;
  }

  &-input input,
  &-caret {
    font-family: inherit;
    font-size: 64px;
    line-height: 72px;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  &-input input {
    display: block;
    width: 100%;
    height: 72px;
    padding: 0;
    border: 0;
    border-radius: var(--db-radius-2);
    background: transparent;
    color: var(--db-ink);
    caret-color: var(--db-brand);
  }

  /* Repeats the typed text invisibly, so the bar lands right behind it. */
  &-caret {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    white-space: pre;
    visibility: hidden;
    pointer-events: none;

    &::after {
      content: '';
      display: inline-block;
      width: 5px;
      height: 54px;
      margin-left: 10px;
      vertical-align: -6px;
      border-radius: 3px;
      background: var(--db-brand);
      visibility: visible;
      animation: home-field-blink 1s steps(1) infinite;
    }
  }

  &-open {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin-right: 12px;
    border-radius: 50%;
    color: var(--db-ink);
    text-decoration: none;
  }

  @media (max-width: 767px) {
    --home-tile: 96px;
    --home-gap: 16px;

    min-height: 630px;
    margin-top: -40vh;
    margin-top: -40dvh;
    padding-top: calc(88px + var(--home-row));
    padding-bottom: 96px;

    &-grid {
      transform: perspective(1320px) rotateX(56deg);
    }

    &-tile {
      border-radius: 26px;
    }

    &-fade-top {
      height: 340px;
    }

    &-fade-left,
    &-fade-right {
      width: 48px;
    }

    &-fade-bottom {
      height: 200px;
    }

    &-box {
      padding: 12px;
      border-radius: 44px;

      &.is-open {
        border-radius: 44px 44px 32px 32px;
      }
    }

    &-row {
      gap: 16px;
      height: 64px;
    }

    &-face {
      width: 64px;
      height: 64px;

      &-badge {
        width: 24px;
        height: 24px;
      }
    }

    &-seed {
      gap: 0;
    }

    &-label {
      font-size: 12px;
      line-height: 16px;
    }

    &-input,
    &-input input {
      height: 40px;
    }

    &-input input,
    &-caret {
      font-size: 32px;
      line-height: 40px;
    }

    &-caret::after {
      width: 3px;
      height: 28px;
      margin-left: 6px;
      vertical-align: -3px;
    }

    &-open {
      width: 44px;
      height: 44px;
      margin-right: 4px;
    }
  }
}

.dark .home-field-box {
  box-shadow: 0 32px 64px -48px rgba(0, 0, 0, 0.85);
}

@keyframes home-field-blink {
  50% {
    opacity: 0;
  }
}
</style>
