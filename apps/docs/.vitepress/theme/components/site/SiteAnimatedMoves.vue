<script setup lang="ts">
/**
 * One style with a switch per move. The avatar plays the moves that are on,
 * and the code below says the same thing in every language. The names of
 * the moves come from the definition.
 */
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { capitalCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import StyleOptionsCodePanel from '../styles/StyleOptionsCodePanel.vue';
import SiteAvatar from './SiteAvatar.vue';
import SiteSwitch from './SiteSwitch.vue';

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
  <section class="site-container site-animated-moves">
    <h2 class="site-headline">Every move has a switch</h2>
    <p class="site-lead site-animated-moves-lead">
      Each style has its own moves, and every move has a name. {{ title }} has
      {{ moves.length }} of them. Switch them one by one and watch the code
      follow.
    </p>
    <a
      href="/playground/"
      class="site-control site-animated-moves-link hv-link"
    >
      Try all {{ animatedCount }} animated styles in the Playground
      <ArrowRight :size="18" />
    </a>
    <div class="site-animated-moves-body">
      <SiteAvatar
        class="site-animated-moves-stage"
        :style-name="styleName"
        :options="avatarOptions"
        mode="library"
        :size="480"
        :radius="64"
        :alt="label"
      />
      <div class="site-animated-moves-panel">
        <span class="site-label">Moves of {{ title }}</span>
        <div class="site-animated-moves-switches">
          <label
            v-for="move in moves"
            :key="move"
            class="site-animated-moves-switch"
          >
            <SiteSwitch
              class="site-animated-moves-track"
              :model-value="!off[move]"
              @update:model-value="toggle(move, $event)"
            />
            <code>{{ move }}</code>
          </label>
        </div>
        <p class="site-text site-animated-moves-note">
          Every move also takes its own speed and delay.
        </p>
        <div class="site-animated-moves-code">
          <StyleOptionsCodePanel
            :style-name="styleName"
            :options="codeOptions"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.site-animated-moves {
  padding-top: 168px;

  &-lead {
    max-width: 760px;
    margin-top: 32px;
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    color: var(--db-brand-text);
  }

  &-body {
    display: grid;
    grid-template-columns: 480px minmax(0, 1fr);
    gap: 64px;
    align-items: start;
    margin-top: 56px;

    @media (max-width: 1023px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 40px;
    }
  }

  &-stage {
    width: 100% !important;
    max-width: 480px;
    height: auto !important;
    aspect-ratio: 1;
  }

  &-panel {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &-switches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 40px;
    margin-top: 16px;
    padding: 12px 0;
    border-top: 1px solid var(--db-line);
    border-bottom: 1px solid var(--db-line);
  }

  &-switch {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    cursor: pointer;

    code {
      font-family: var(--db-font-mono);
      font-size: 16px;
      line-height: 24px;
      color: var(--db-ink);
    }
  }

  /* The switch one step larger than in a filter row. */
  & &-track {
    width: 44px;
    height: 26px;
    border-radius: 13px;

    &::before {
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
    }
  }

  &-note {
    margin-top: 16px;
    color: var(--db-muted);
  }

  &-code {
    min-width: 0;
    margin-top: 40px;
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-lead {
      margin-top: 24px;
    }

    &-body {
      margin-top: 40px;
    }

    &-stage {
      border-radius: 40px !important;
    }
  }
}
</style>
