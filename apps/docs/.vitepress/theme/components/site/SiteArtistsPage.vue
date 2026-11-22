<script setup lang="ts">
/**
 * The artists page: who drew the styles DiceBear did not draw itself. Their
 * three most seen styles on yellow, every artist with a link and their
 * styles, what their licenses mean, and an invitation to draw the next one.
 * The figures arrive with the statistics after mount; until then the
 * yellow block keeps its place with the artists alone.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import { ArrowRight, Globe } from '@lucide/vue';
import { siDribbble, siInstagram, siX } from 'simple-icons';
import type { ThemeOptions } from '@theme/types';
import type { LicenseBucket } from '@theme/config/styleCategories';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import { useStyleRankings } from '@theme/composables/useStyleRankings';
import { guestArtists, type ArtistLinkKind } from '@theme/utils/artists';
import UiIcon from '../ui/UiIcon.vue';
import SiteAvatar from './SiteAvatar.vue';
import SitePageHead from './SitePageHead.vue';
import SiteSection from './SiteSection.vue';

const { theme } = useData<ThemeOptions>();
const { rankings, currentWeekLabel } = useStyleRankings();

const artists = computed(() => guestArtists(theme.value.avatarStyles));
const guestStyles = computed(() => artists.value.flatMap((a) => a.styles));

const ICONS: Partial<Record<ArtistLinkKind, { path: string }>> = {
  instagram: siInstagram,
  x: siX,
  dribbble: siDribbble,
};

/** The three guest styles the most websites requested last week. */
const featured = computed(() => {
  if (!rankings.value) {
    return [];
  }

  const bySlug = new Map(
    artists.value.flatMap((artist) =>
      artist.styles.map((style) => [style.slug, { artist, style }] as const),
    ),
  );

  return rankings.value
    .map((row) => ({ row, entry: bySlug.get(kebabCase(row.name)) }))
    .filter((item) => item.entry)
    .slice(0, 3)
    .map(({ row, entry }) => ({
      artist: entry!.artist.name,
      style: entry!.style,
      websites: row.websites.toLocaleString('en-US'),
      seeds: getStyleCardSeeds(entry!.style.slug).slice(0, 4),
    }));
});

const LICENSES: Record<LicenseBucket, { term: string; text: string }> = {
  'CC BY 4.0': {
    term: 'CC BY 4.0',
    text: 'Free to use if you name the artist and the license.',
  },
  'CC0 1.0': {
    term: 'CC0 1.0',
    text: 'Free to use without attribution.',
  },
  Other: {
    term: 'Artist’s own terms',
    text: 'The artist wrote the terms. Each style links to the original wording.',
  },
  MIT: {
    term: 'MIT',
    text: 'The style keeps the license of the work it is built from.',
  },
};

const licenses = computed(() =>
  (Object.keys(LICENSES) as LicenseBucket[])
    .map((bucket) => ({
      ...LICENSES[bucket],
      count: guestStyles.value.filter((style) => style.bucket === bucket)
        .length,
    }))
    .filter((license) => license.count > 0),
);

function countLabel(count: number): string {
  return `${count} ${count === 1 ? 'style' : 'styles'}`;
}

const FAN = [
  { style: 'lorelei', seed: 'Ingrid' },
  { style: 'notionists', seed: 'Aneka' },
  { style: 'croodles', seed: 'Mia' },
];
</script>

<template>
  <div class="site-artists">
    <SitePageHead
      :crumbs="[{ text: 'Home', link: '/' }, { text: 'Artists' }]"
      title="The artists"
      :aside-width="360"
      aside-align="end"
    >
      <p>
        {{ guestStyles.length }} of the {{ theme.styleCount }} styles were not
        drawn by us. They come from {{ artists.length }} independent artists and
        teams who shared their work under an open license. DiceBear turns that
        work into avatars. The credit stays theirs.
      </p>
      <template #aside>
        <div class="site-fan" aria-hidden="true">
          <SiteAvatar
            v-for="item in FAN"
            :key="item.style"
            sticker
            :style-name="item.style"
            :options="{ seed: item.seed }"
          />
        </div>
      </template>
    </SitePageHead>

    <SiteSection
      tone="sun"
      layout="stack"
      size="l"
      title="Seen the most"
      class="site-artists-featured"
    >
      <template #hint>
        <template v-if="currentWeekLabel">
          The three styles by guest artists that the most websites used in the
          week of {{ currentWeekLabel }}.
        </template>
        <template v-else>
          The styles by guest artists that the most websites use.
        </template>
      </template>
      <div class="site-grid site-artists-cards">
        <template v-if="featured.length">
          <a
            v-for="item in featured"
            :key="item.style.slug"
            :href="`/styles/${item.style.slug}/`"
            class="site-box is-card is-code site-artists-card"
          >
            <span class="site-artists-card-avatars">
              <SiteAvatar
                v-for="seed in item.seeds"
                :key="seed"
                :style-name="item.style.slug"
                :options="{ seed }"
                :alt="`${item.style.title} avatar`"
              />
            </span>
            <span class="site-heading">{{ item.artist }}</span>
            <span class="site-body">{{ item.style.title }}</span>
            <span class="site-artists-card-figure">{{ item.websites }}</span>
            <span class="site-text">websites in one week</span>
          </a>
        </template>
        <template v-else>
          <div
            v-for="n in 3"
            :key="n"
            class="site-box is-card is-code site-artists-card is-empty"
            aria-hidden="true"
          ></div>
        </template>
      </div>
      <a href="/stats/" class="site-link-arrow">All statistics</a>
    </SiteSection>

    <section class="site-container site-artists-list">
      <div class="site-artists-list-head">
        <h2 class="site-h2">Artists</h2>
        <p class="site-body">
          Each style keeps the name of the work it is based on and the license
          its artist chose.
        </p>
      </div>
      <div class="site-rows is-between site-artists-rows">
        <div
          v-for="artist in artists"
          :key="artist.name"
          class="site-row site-artists-artist"
        >
          <div class="site-artists-artist-head">
            <h3 class="site-heading">{{ artist.name }}</h3>
            <p class="site-text">{{ countLabel(artist.styles.length) }}</p>
            <a
              v-if="artist.link"
              :href="artist.link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="site-btn site-btn-secondary site-artists-link"
            >
              <UiIcon
                v-if="ICONS[artist.link.kind]"
                :path="ICONS[artist.link.kind]!.path"
                :size="16"
                aria-hidden="true"
              />
              <Globe v-else :size="16" aria-hidden="true" />
              {{ artist.link.label }}
              <span class="sr-only">of {{ artist.name }}</span>
            </a>
          </div>
          <div class="site-rows site-artists-styles">
            <a
              v-for="style in artist.styles"
              :key="style.slug"
              :href="`/styles/${style.slug}/`"
              class="site-row site-artists-style"
            >
              <SiteAvatar
                :style-name="style.slug"
                :options="{ seed: getStyleCardSeeds(style.slug)[0] }"
                :size="56"
                :alt="`${style.title} avatar`"
              />
              <span class="site-artists-style-name">
                <span class="site-title">{{ style.title }}</span>
                <span v-if="style.work" class="site-text">{{
                  style.work
                }}</span>
              </span>
              <span class="site-text site-artists-style-license">{{
                style.license
              }}</span>
              <ArrowRight :size="20" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <SiteSection tone="soft" title="Their license, their terms">
      <template #hint>
        All avatars are remixes of the original works. Which license applies
        depends on the style, not on DiceBear.
      </template>
      <template #aside>
        <a href="/licenses/" class="site-link-arrow">All licenses</a>
      </template>
      <dl class="site-facts is-strong">
        <div
          v-for="license in licenses"
          :key="license.term"
          class="site-fact site-artists-license"
        >
          <dt>
            {{ license.term }}
            <span class="site-text">{{ countLabel(license.count) }}</span>
          </dt>
          <dd>{{ license.text }}</dd>
        </div>
      </dl>
    </SiteSection>

    <SiteSection
      tone="mint"
      layout="stack"
      size="l"
      title="Your style could be next"
      hint="Draw it in Figma and export it with DiceBear Studio. New styles are welcome on GitHub."
    >
      <div class="site-actions">
        <a href="/studio/" class="site-btn site-btn-lg site-btn-primary"
          >DiceBear Studio</a
        >
        <a
          href="/create-styles/with-figma/"
          class="site-btn site-btn-lg site-btn-secondary"
          >Create a style with Figma</a
        >
      </div>
    </SiteSection>
    <div class="site-end"></div>
  </div>
</template>

<style scoped lang="scss">
.site-artists {
  &-featured {
    margin-top: clamp(48px, 6vw, 88px);
  }

  &-cards {
    --site-grid-min: 300px;

    gap: 16px;
  }

  /* A card per style: four avatars, the artist, the style and its figure. */
  &-card {
    display: flex;
    flex-direction: column;
    color: var(--db-ink);
    text-decoration: none;

    &.is-empty {
      min-height: 320px;
    }

    &-avatars {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 20px;
    }

    .site-body {
      margin-top: 4px;
    }

    &-figure {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--db-line);
      font-family: var(--db-font-display);
      font-size: clamp(32px, 3.4vw, 48px);
      line-height: 1;
      font-weight: 800;
      font-variant-numeric: tabular-nums;

      + .site-text {
        margin-top: 6px;
        color: var(--db-muted);
      }
    }

    &:hover .site-heading {
      text-decoration: underline;
      text-decoration-thickness: 3px;
      text-underline-offset: 6px;
    }
  }

  &-list {
    padding-top: clamp(64px, 8vw, 120px);
    padding-bottom: clamp(32px, 4vw, 56px);

    &-head {
      padding-bottom: clamp(32px, 3.4vw, 48px);

      .site-body {
        max-width: 640px;
        margin-top: 16px;
      }
    }
  }

  /* An artist: the name and the link on the left, the styles on the right.
     The one line of the list runs between the artists. */
  &-artist {
    display: flex;
    flex-wrap: wrap;
    gap: 16px clamp(32px, 5vw, 80px);

    .site-rows > & {
      padding: 32px 0;
    }

    .is-between > &:first-child {
      padding-top: 0;
    }

    .is-between > &:last-child {
      padding-bottom: 0;
    }

    &-head {
      flex: 1 1 280px;
      max-width: 360px;

      .site-text {
        margin-top: 8px;
        color: var(--db-muted);
      }
    }
  }

  &-link {
    margin-top: 16px;
  }

  /* The styles part by space alone. The negative margin keeps the avatars
     and arrows on the column's edge while a row's hover ground reaches past
     them. */
  &-styles {
    flex: 999 1 520px;
    gap: 2px;
    min-width: 0;
    margin: -8px -12px;
    border-bottom: 0;
  }

  &-style {
    gap: 8px 28px;

    .site-rows > & {
      padding: 8px 12px;
      border-top: 0;
      border-radius: 22px;
    }

    &:hover {
      background: color-mix(in srgb, var(--db-ink) 7%, transparent);
    }

    &-name {
      display: flex;
      flex: 1 1 200px;
      flex-direction: column;
      min-width: 0;

      .site-text {
        color: var(--db-muted);
      }
    }

    &-license {
      flex: 0 1 220px;
    }

    &:hover .site-title {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }

    /* On a phone the name and the license stack beside the avatar, with
       the arrow at the end of the row. */
    @media (max-width: 767px) {
      .site-rows > & {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 2px 14px;
      }

      > :first-child,
      > svg {
        grid-row: 1 / span 2;
      }

      > svg {
        grid-column: 3;
      }

      &-name {
        grid-column: 2;
        align-self: end;
      }

      &-license {
        grid-column: 2;
        align-self: start;
        color: var(--db-muted);
      }
    }
  }

  &-license dt {
    flex-basis: 200px;

    .site-text {
      display: block;
      font-family: var(--db-font);
      font-weight: 400;
      color: var(--db-muted);
    }
  }
}
</style>
