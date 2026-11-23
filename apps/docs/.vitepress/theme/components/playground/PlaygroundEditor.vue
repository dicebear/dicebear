<script setup lang="ts">
/**
 * The tray of the editor view, under the avatar. A switch chooses between
 * the parts and the colors, a tab picks one of them, and every tile shows the
 * whole avatar with one choice. A tile pins that one option, everything else
 * stays with the seed. Colors are options of their own and not tied to a
 * part, since one color can paint several parts. Tabs of parts and colors
 * the avatar does not show are greyed out.
 */
import { computed, inject, ref, watch } from 'vue';
import { computedAsync, useDebounceFn } from '@vueuse/core';
import { capitalCase } from 'change-case';
import { Avatar } from '@dicebear/core';
import useStore from '@theme/stores/playground';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';
import { stripHash } from '@theme/utils/avatar/colors';
import {
  playgroundEntriesKey,
  type ColorInfo,
  type ComponentInfo,
  type PlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import SiteSegmented from '../site/SiteSegmented.vue';
import SiteTabs from '../site/SiteTabs.vue';

const injected = inject(playgroundEntriesKey);

if (!injected) {
  throw new Error('PlaygroundEditor needs the entries of PlaygroundApp.');
}

const entries: PlaygroundEntries = injected;

const store = useStore();

type Group = 'parts' | 'colors';

type Tab =
  | { id: string; label: string; kind: 'component'; info: ComponentInfo }
  | { id: string; label: string; kind: 'color'; info: ColorInfo };

const parts = computed<Tab[]>(() =>
  entries.components.value.map((info) => ({
    id: `component:${info.name}`,
    label: capitalCase(info.name),
    kind: 'component',
    info,
  })),
);

// The background closes the list, after the colors of the avatar itself.
const colors = computed<Tab[]>(() => {
  const list = entries.colors.value;

  return [
    ...list.filter((info) => info.name !== 'background'),
    ...list.filter((info) => info.name === 'background'),
  ].map((info) => ({
    id: `color:${info.name}`,
    label: capitalCase(info.name),
    kind: 'color',
    info,
  }));
});

const groups = computed(() => [
  ...(parts.value.length > 0
    ? [{ value: 'parts' as Group, label: 'Parts' }]
    : []),
  ...(colors.value.length > 0
    ? [{ value: 'colors' as Group, label: 'Colors' }]
    : []),
]);

const group = ref<Group>('parts');
const chosen = ref<Record<Group, string>>({ parts: '', colors: '' });

// Another style starts on its parts again, or on its colors when it has
// none.
watch(
  () => store.avatarStyleName,
  () => {
    group.value = 'parts';
    chosen.value = { parts: '', colors: '' };
  },
);

const activeGroup = computed<Group>(() =>
  groups.value.some((option) => option.value === group.value)
    ? group.value
    : (groups.value[0]?.value ?? 'parts'),
);

const tabs = computed(() =>
  activeGroup.value === 'parts' ? parts.value : colors.value,
);

// The options the avatar takes as it stands. A part nothing draws, or a
// color no drawn part wears, would show the same avatar on every tile, so
// its tab is greyed out. A part its probability leaves out still counts,
// since a tile brings it back.
const used = computedAsync<Set<string> | null>(async () => {
  const styleName = store.avatarStyleName;
  const options = clonePlain({
    ...store.avatarStyleOptionsWithoutDefaults,
    seed: store.seed,
  });

  try {
    const style = await loadAvatarStyle(styleName);

    return new Set(Object.keys(new Avatar(style, options).toJSON().options));
  } catch {
    return null;
  }
}, null);

function isUnused(tab: Tab): boolean {
  const key =
    tab.kind === 'component' ? `${tab.info.name}Variant` : tab.info.key;

  return used.value !== null && !used.value.has(key);
}

// The tabs run in the order of the advanced list, which is the alphabet.
// Until someone picks one, the part with the most variants is open, and the
// color of the same name when there is one. That is the hair more often than
// not, where a person looking for a change goes first.
const richestPart = computed(() =>
  parts.value.reduce<Tab | undefined>(
    (best, tab) =>
      tab.kind === 'component' &&
      (best?.kind !== 'component' ||
        tab.info.variants.length > best.info.variants.length)
        ? tab
        : best,
    undefined,
  ),
);

// A greyed out tab is never the open one. When the open tab greys out, as
// after a new seed, the default of its group takes over until it comes
// back.
const fallback = computed<Tab | undefined>(() => {
  const name = richestPart.value?.info.name;
  const preferred =
    activeGroup.value === 'parts'
      ? richestPart.value
      : colors.value.find((tab) => tab.info.name === name);

  return preferred && !isUnused(preferred)
    ? preferred
    : tabs.value.find((tab) => !isUnused(tab));
});

const current = computed<Tab | undefined>(() => {
  const picked = tabs.value.find(
    (tab) => tab.id === chosen.value[activeGroup.value],
  );

  return picked && !isUnused(picked) ? picked : fallback.value;
});

function choose(tab: Tab) {
  chosen.value[activeGroup.value] = tab.id;
}

/** The tabs as the shared tab row takes them; greyed out ones stay disabled. */
const tabItems = computed(() =>
  tabs.value.map((tab) => ({
    id: tab.id,
    label: tab.label,
    disabled: isUnused(tab),
  })),
);

function chooseId(id: string) {
  const tab = tabs.value.find((entry) => entry.id === id);

  if (tab && !isUnused(tab)) {
    choose(tab);
  }
}

/**
 * The background colors of the editor for a style that brings none of its
 * own: light steps of twelve hues.
 */
// prettier-ignore
const FALLBACK_BACKGROUNDS = [
  'fff1f5', 'ffdde6', 'ffc8d8', 'ffb3c9', 'fc9ebb',
  'fff2ef', 'ffdfd9', 'ffcbc2', 'ffb7ab', 'ffa293',
  'fff3e9', 'ffe1c9', 'ffcfa8', 'ffbc84', 'f5ac6f',
  'fff5d9', 'ffe5a0', 'f7d67c', 'e9c96e', 'dbbb60',
  'edffb9', 'ddf399', 'cfe58c', 'c2d77e', 'b5ca71',
  'dfffe4', 'aefebe', 'a0efb1', '85d496',
  'd8fff6', '91ffea', '77f3dc', '68e5cf', '59d7c1',
  'e2faff', 'b6f4ff', '80ecff', '5fe0f6', '4fd3e8',
  'ecf7ff', 'd1ebff', 'b5e0ff', '97d4ff', '77c8ff',
  'f1f5ff', 'dee7ff', 'cbd9ff', 'b8caff', 'a5bcff',
  'f7f3ff', 'ebe2ff', 'e0d0ff', 'd5bfff', 'caadfe',
  'fff0fd', 'ffdafa', 'ffc2f9', 'f7b0f0',
];

type Tile =
  | { kind: 'variant'; id: string; label: string; value: string }
  | { kind: 'none'; id: string; label: string }
  | { kind: 'color'; id: string; label: string; value: string }
  | { kind: 'custom'; id: string; label: string; value: string };

type Drawn = Tile & { src: string; active: boolean };

function sameHex(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

// The tiles of the open tab, each the avatar as it would look with that
// choice. What the seed resolves to marks the chosen tile, so a part left to
// the seed shows its variant as chosen too. Everything the render depends on
// is read before the first await.
const drawn = computedAsync<Drawn[]>(async () => {
  const tab = current.value;
  const styleName = store.avatarStyleName;
  const base = clonePlain({
    ...store.avatarStyleOptionsWithoutDefaults,
    seed: store.seed,
  });
  const pinned: unknown =
    tab?.kind === 'color' ? store.avatarStyleOptions[tab.info.key] : undefined;
  const pinnedColor =
    Array.isArray(pinned) &&
    pinned.length === 1 &&
    typeof pinned[0] === 'string'
      ? pinned[0]
      : null;

  if (!tab) return [];

  try {
    const style = await loadAvatarStyle(styleName);
    const draw = (extra: Record<string, unknown>) =>
      new Avatar(style, { ...clonePlain(base), ...extra }).toDataUri();
    const resolved = new Avatar(style, clonePlain(base)).toJSON()
      .options as Record<string, unknown>;

    if (tab.kind === 'component') {
      const { name, variants, defaultProbability } = tab.info;
      const variantKey = `${name}Variant`;
      const probabilityKey = `${name}Probability`;
      const optional = defaultProbability < 100;
      // Set by hand, say to 0 in another view, it would hide every variant.
      const forceShown =
        optional || store.avatarStyleOptions[probabilityKey] !== undefined;
      const shown = resolved[variantKey];
      const result: Drawn[] = [];

      if (optional) {
        result.push({
          kind: 'none',
          id: 'none',
          label: `No ${tab.label.toLowerCase()}`,
          src: draw({ [probabilityKey]: 0 }),
          active: shown === undefined,
        });
      }

      for (const variant of variants) {
        result.push({
          kind: 'variant',
          id: variant,
          label: `${tab.label} ${variant}`,
          value: variant,
          src: draw({
            [variantKey]: [variant],
            ...(forceShown ? { [probabilityKey]: 100 } : {}),
          }),
          active: shown === variant,
        });
      }

      return result;
    }

    const { key, name, defaultValues } = tab.info;
    const background = name === 'background';
    const values =
      background && defaultValues.length === 0
        ? FALLBACK_BACKGROUNDS
        : defaultValues;
    const shownList = Array.isArray(resolved[key])
      ? (resolved[key] as string[])
      : [];
    const shown = shownList.length > 0 ? stripHash(shownList[0]) : null;

    // A color of one's own is one that is set and not in the list.
    const own =
      pinnedColor !== null &&
      !values.some((value) => sameHex(value, pinnedColor))
        ? pinnedColor
        : null;

    const result: Drawn[] = [
      {
        kind: 'custom',
        id: 'custom',
        label: `Pick a ${tab.label.toLowerCase()} color`,
        value: own ?? shown ?? 'ffffff',
        src: draw({}),
        active: own !== null,
      },
    ];

    if (background) {
      result.push({
        kind: 'none',
        id: 'none',
        label: 'No background',
        src: draw({ [key]: [] }),
        active: shown === null,
      });
    }

    for (const value of values) {
      result.push({
        kind: 'color',
        id: value,
        label: `#${value}`,
        value,
        src: draw({ [key]: [value] }),
        active: own === null && shown !== null && sameHex(shown, value),
      });
    }

    return result;
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Editor tiles failed:', e);
    }

    return [];
  }
}, []);

function pick(tile: Drawn) {
  const tab = current.value;

  if (!tab) return;

  const options = store.avatarStyleOptions;

  if (tab.kind === 'component') {
    const probabilityKey = `${tab.info.name}Probability`;

    if (tile.kind === 'none') {
      options[probabilityKey] = 0;

      return;
    }

    if (tile.kind === 'variant') {
      options[`${tab.info.name}Variant`] = [tile.value];

      if (
        tab.info.defaultProbability < 100 ||
        options[probabilityKey] !== undefined
      ) {
        options[probabilityKey] = 100;
      }
    }

    return;
  }

  if (tile.kind === 'none') {
    options[tab.info.key] = [];
  } else if (tile.kind === 'color') {
    options[tab.info.key] = [tile.value];
  }
}

// The native picker fires on every step of a drag. The tiles redraw at most
// every 50ms.
const pickOwn = useDebounceFn(
  (key: string, hex: string) => {
    store.avatarStyleOptions[key] = [hex];
  },
  50,
  { maxWait: 50 },
);

function onOwnColor(event: Event) {
  const tab = current.value;

  if (tab?.kind !== 'color') return;

  void pickOwn(
    tab.info.key,
    (event.target as HTMLInputElement).value.replace('#', ''),
  );
}
</script>

<template>
  <div class="pg-editor">
    <div class="pg-editor-head">
      <SiteSegmented
        v-if="groups.length > 1"
        v-model="group"
        :options="groups"
        aria-label="Edit"
        class="pg-editor-group"
      />

      <SiteTabs
        :model-value="current?.id ?? ''"
        :tabs="tabItems"
        :aria-label="activeGroup === 'parts' ? 'Parts' : 'Colors'"
        class="pg-editor-tabs"
        @update:model-value="chooseId"
      />
    </div>

    <div
      v-if="current"
      class="pg-editor-body"
      role="tabpanel"
      :aria-label="current.label"
    >
      <div class="pg-editor-tiles">
        <template v-for="tile in drawn" :key="tile.id">
          <label
            v-if="tile.kind === 'custom'"
            class="pg-editor-tile"
            :class="{ 'is-active': tile.active }"
          >
            <img :src="tile.src" alt="" />
            <span class="pg-editor-badge is-wheel" aria-hidden="true" />
            <input
              type="color"
              class="pg-editor-picker"
              :aria-label="tile.label"
              :value="`#${tile.value}`"
              @input="onOwnColor"
            />
          </label>
          <button
            v-else
            type="button"
            class="pg-editor-tile"
            :class="{ 'is-active': tile.active }"
            :aria-label="tile.label"
            :aria-pressed="tile.active"
            @click="pick(tile)"
          >
            <img :src="tile.src" alt="" />
            <span
              v-if="tile.kind === 'none'"
              class="pg-editor-badge is-none"
              aria-hidden="true"
            />
          </button>
        </template>
      </div>
      <!-- What scrolls in after the tiles, such as a phone's status line. -->
      <slot name="end" />
    </div>

    <p v-else class="pg-editor-empty">
      This style has no parts or colors to pick from.
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as m;

.pg-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  border-top: 1px solid var(--db-line);

  &-head {
    display: flex;
    flex-shrink: 0;
    align-items: stretch;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--db-line);
  }

  &-group {
    align-self: center;
    flex-shrink: 0;
  }

  /* The tiles scroll on their own, so the avatar stays in view. A scroll box
     clips on every side and a tile's ring reaches 4px past it, so the box
     takes a little more room while the tiles stay on the column's edge. */
  &-body {
    flex: 1;
    min-height: 0;
    margin-inline: -6px;
    padding-inline: 6px;
    overflow-y: auto;
  }

  &-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
    gap: 8px;
    padding: 20px 0;
  }

  &-tile {
    display: block;
    aspect-ratio: 1 / 1;
    border: 0;
    border-radius: var(--db-radius-3);
    overflow: hidden;
    cursor: pointer;

    @include m.avatar-ground;

    &:hover {
      outline: 2px solid var(--db-ink-2);
      outline-offset: 2px;
    }

    &.is-active {
      outline: 2px solid var(--db-focus);
      outline-offset: 2px;
    }

    &:focus-visible,
    &:has(:focus-visible) {
      outline: 2px solid var(--db-focus);
      outline-offset: 2px;
    }
  }

  /* A mark in the corner for the two tiles that are not a value: the
     color wheel of one's own color, the struck circle of none. */
  &-badge {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 22px;
    height: 22px;
    box-sizing: border-box;
    border: 2px solid var(--db-paper);
    border-radius: 50%;

    &.is-wheel {
      background: conic-gradient(
        #ef4444,
        #eab308,
        #22c55e,
        #06b6d4,
        #3b82f6,
        #d946ef,
        #ef4444
      );
    }

    &.is-none {
      background:
        linear-gradient(
          to top right,
          transparent calc(50% - 1px),
          var(--db-danger) calc(50% - 1px),
          var(--db-danger) calc(50% + 1px),
          transparent calc(50% + 1px)
        ),
        var(--db-paper);
      box-shadow: 0 0 0 1px var(--db-field-border);
    }
  }

  /* The native picker lies over the whole tile, so a click anywhere on it
     opens the picker in every browser. */
  &-picker {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: pointer;
  }

  &-empty {
    margin: 0;
    padding: 24px 0;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-muted);
  }

  /* A short window keeps more of the second row of tiles in view. */
  @media (min-width: 768px) and (max-height: 799px) {
    &-tiles {
      padding: 12px 0;
    }
  }

  /* Without the page's edge the tray keeps 16px of its own, as everywhere
     else on a small screen. */
  @media (max-width: 959px) {
    &-head {
      padding: 10px 16px;
    }

    &-body {
      margin-inline: 0;
      padding-inline: 0;
    }

    &-tiles {
      padding: 12px 16px;
    }

    &-empty {
      padding: 24px 16px;
    }
  }

  @media (max-width: 767px) {
    &-tiles {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
</style>
