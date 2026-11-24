<script setup lang="ts">
/**
 * One style with a switch per move. The avatar plays the moves that are on,
 * and the code below says the same thing in every language. The names of
 * the moves come from the definition.
 */
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { capitalCase } from 'change-case';
import type { ThemeOptions } from '@theme/types';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import StyleOptionsCodePanel from '../styles/StyleOptionsCodePanel.vue';
import SiteAvatar from './SiteAvatar.vue';
import SiteSwitch from './SiteSwitch.vue';
import SiteSection from './SiteSection.vue';

const { theme } = useData<ThemeOptions>();

const styleName = 'critters';
const title = capitalCase(styleName);
const seed = getStyleCardSeeds(styleName)[1] ?? 'Felix';

const animatedCount = computed(
  () =>
    Object.values(theme.value.avatarStyles).filter((style) => style.animated)
      .length,
);

const moves = computed(
  () => theme.value.avatarStyles[styleName]?.animations ?? [],
);

/** The moves that are switched off. Every move starts switched on. */
const off = ref<Record<string, boolean>>({});

const active = computed(() => moves.value.filter((move) => !off.value[move]));

function toggle(move: string, on: boolean) {
  off.value = { ...off.value, [move]: !on };
}

/** The avatar names every move that plays. */
const avatarOptions = computed(() => {
  const options: Record<string, unknown> = { seed };
  for (const move of active.value) {
    options[`${move}Animation`] = true;
  }
  return options;
});

/**
 * The code says the same in the fewest options: everything, nothing, the
 * global switch with its exceptions, or the single moves.
 */
const codeOptions = computed(() => {
  const options: Record<string, unknown> = { seed };
  const resting = moves.value.filter((move) => off.value[move]);
  if (active.value.length === 0) {
    return options;
  }
  if (active.value.length >= resting.length) {
    options.animation = true;
    for (const move of resting) {
      options[`${move}Animation`] = false;
    }
    return options;
  }
  for (const move of active.value) {
    options[`${move}Animation`] = true;
  }
  return options;
});

const label = computed(() =>
  active.value.length > 0
    ? `${title} avatar, moves: ${active.value.join(', ')}`
    : `${title} avatar, at rest`,
);
</script>

<template>
  <SiteSection tone="sun" layout="stack" title="Every move has a switch">
    <template #hint>
      Each style has its own moves, and every move has a name. {{ title }} has
      {{ moves.length }} of them. Switch them one by one and watch the code
      follow.
    </template>
    <div class="site-pair is-top site-animated-moves">
      <SiteAvatar
        sticker
        class="site-animated-moves-stage"
        :style-name="styleName"
        :options="avatarOptions"
        mode="library"
        :alt="label"
      />
      <div class="site-animated-moves-panel">
        <span class="site-control">Moves of {{ title }}</span>
        <div class="site-animated-moves-switches">
          <label
            v-for="move in moves"
            :key="move"
            class="site-animated-moves-switch"
          >
            <SiteSwitch
              :model-value="!off[move]"
              @update:model-value="toggle(move, $event)"
            />
            <code class="site-animated-moves-name">{{ move }}</code>
          </label>
        </div>
        <p class="site-text">Every move also takes its own speed and delay.</p>
        <StyleOptionsCodePanel :style-name="styleName" :options="codeOptions" />
        <a href="/playground/" class="site-link-arrow">
          Try all {{ animatedCount }} animated styles in the Playground
        </a>
      </div>
    </div>
  </SiteSection>
</template>
<style scoped lang="scss">
.site-animated-moves {
  &-stage {
    --site-sticker-edge: 5%;

    width: min(100%, 440px);
    transform: rotate(-2deg);
  }

  &-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;

    > :deep(*:not(a)) {
      align-self: stretch;
    }
  }

  &-switches {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 32px;
  }

  &-switch {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 48px;
    cursor: pointer;
  }

  /* The name of the move as it goes into the options. */
  &-name {
    padding: 2px 10px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--db-ink) 10%, transparent);
    font-family: var(--db-font-mono);
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
    color: var(--db-ink);
  }
}
</style>
