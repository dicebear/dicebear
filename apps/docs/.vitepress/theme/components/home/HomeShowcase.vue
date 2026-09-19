<script setup lang="ts">
/**
 * Three rows that split the catalog the way people look for a style: the
 * abstract ones, the characters and the ones that move. Each row has a few
 * sentences on one side and nine avatars on the other. The counts in the
 * text come from the catalog.
 */
import { computed, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import {
  getStyleCategory,
  type StyleCategory,
} from '@theme/config/styleCategories';
import { styleDisplayName } from '@theme/utils/styleMeta';
import SiteAvatar from '../site/SiteAvatar.vue';

const { theme } = useData<ThemeOptions>();

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

/** A count as the word that opens a sentence: 21 becomes "Twenty-one". */
function spellCount(count: number): string {
  if (count < 0 || count > 99) {
    return String(count);
  }

  const tens = Math.floor(count / 10);
  const ones = count % 10;
  const word =
    count < 20
      ? ONES[count]
      : ones === 0
        ? TENS[tens]
        : `${TENS[tens]}-${ONES[ones]}`;

  return word.charAt(0).toUpperCase() + word.slice(1);
}

function countCategory(category: StyleCategory): number {
  return Object.keys(theme.value.avatarStyles).filter(
    (name) => getStyleCategory(name) === category,
  ).length;
}

const reducedMotion = ref(false);

onMounted(() => {
  reducedMotion.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
});

interface Row {
  id: string;
  title: string;
  text: string;
  link: { text: string; href: string };
  styles: string[];
  animated: boolean;
  /** The avatars stand on the left and the text on the right. */
  flipped: boolean;
}

const content = computed<Row[]>(() => [
  {
    id: 'minimalist',
    title: 'Calm and abstract',
    text: `${spellCount(countCategory('Minimalist'))} minimalist styles: patterns, shapes and initials that sit quietly next to the rest of your interface.`,
    link: {
      text: 'See the minimalist styles',
      href: withBase('/styles/#minimalist'),
    },
    styles: [
      'glass',
      'rings',
      'stack',
      'slice',
      'waves',
      'patchwork',
      'shapes',
      'squircles',
      'loops',
    ],
    animated: false,
    flipped: false,
  },
  {
    id: 'characters',
    title: 'Faces with character',
    text: `${spellCount(countCategory('Characters'))} character styles, from hand-drawn people to pixel figures and animals. Many of them come from independent artists.`,
    link: {
      text: 'See the character styles',
      href: withBase('/styles/#characters'),
    },
    styles: [
      'notionists',
      'lorelei',
      'cats',
      'dogs',
      'open-peeps',
      'voxel-art',
      'adventurer',
      'micah',
      'avataaars',
    ],
    animated: false,
    flipped: true,
  },
  {
    id: 'animated',
    title: 'Avatars that move',
    text: `${spellCount(theme.value.animatedStyleCount)} styles carry a looping animation inside the SVG. One option switches it on, and a plain img tag plays it.`,
    link: {
      text: 'See the animated styles',
      href: withBase('/animated-avatars/'),
    },
    styles: [
      'shapes',
      'cats',
      'loops',
      'critters',
      'glass',
      'dogs',
      'squircles',
      'gaze',
      'waves',
    ],
    animated: true,
    flipped: false,
  },
]);

/** Animated tiles hold their resting frame for visitors who asked for less motion. */
const rows = computed(() =>
  content.value.map((row) => {
    const moves = row.animated && !reducedMotion.value;

    return {
      ...row,
      tiles: row.styles.map((styleName) => {
        const seed = getStyleCardSeeds(styleName)[0];
        const title = styleDisplayName(styleName);

        return {
          styleName,
          options: moves ? { seed, animation: true } : { seed },
          alt: moves ? `Animated ${title} avatar` : `${title} avatar`,
        };
      }),
    };
  }),
);
</script>

<template>
  <section
    v-for="row in rows"
    :key="row.id"
    class="home-wrap home-showcase"
    :class="{ 'is-flipped': row.flipped }"
  >
    <div class="home-showcase-text">
      <h2 class="site-headline">{{ row.title }}</h2>
      <p class="site-body home-showcase-body">{{ row.text }}</p>
      <a :href="row.link.href" class="site-control home-showcase-link hv-link">
        {{ row.link.text }}
        <ArrowRight :size="18" aria-hidden="true" />
      </a>
    </div>
    <div class="home-showcase-grid">
      <SiteAvatar
        v-for="tile in row.tiles"
        :key="tile.styleName"
        :style-name="tile.styleName"
        :options="tile.options"
        :mode="row.animated ? 'library' : 'http-api'"
        :size="170"
        :radius="44"
        :alt="tile.alt"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-showcase {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 80px;
  align-items: center;
  padding-top: 168px;

  &.is-flipped {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  }

  &.is-flipped &-text {
    order: 1;
  }

  &-body {
    margin-top: 32px;
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    color: var(--db-brand-text);
    text-decoration: none;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    width: min(560px, 100%);
    justify-self: end;

    :deep(.site-avatar) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }
  }

  &.is-flipped &-grid {
    justify-self: start;
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
    padding-top: 128px;

    &.is-flipped {
      grid-template-columns: minmax(0, 1fr);
    }

    &.is-flipped &-text {
      order: 0;
    }

    &-grid,
    &.is-flipped &-grid {
      justify-self: start;
    }
  }

  @media (max-width: 767px) {
    gap: 40px;
    padding-top: 96px;

    &-body,
    &-link {
      margin-top: 24px;
    }

    &-grid {
      gap: 12px;

      :deep(.site-avatar) {
        border-radius: 28px !important;
      }
    }
  }
}
</style>
