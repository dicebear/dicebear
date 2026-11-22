<script setup lang="ts">
/**
 * Section four: a style of your own. Three ways in an accordion, one open
 * at a time, and on the right what the open one looks like: the gallery of
 * the Figma plugin, an excerpt of a definition file, or the places that
 * read one.
 */
import { computed, ref } from 'vue';
import { useData, withBase } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import {
  DEFINITION_EXCERPT,
  DEFINITION_READERS,
  DEFINITION_STYLE,
  LINKS,
} from '@theme/config/home';
import SiteAvatar from '../site/SiteAvatar.vue';
import SiteDisclosure from '../site/SiteDisclosure.vue';
import SiteEyebrow from '../site/SiteEyebrow.vue';
import UiCode from '../ui/UiCode.vue';

type Way = 'figma' | 'hand' | 'use';

const { theme } = useData<ThemeOptions>();

const way = ref<Way>('figma');

/** Opening a row shows its picture; the last row closing keeps it. */
function toggle(next: Way, open: boolean) {
  if (open) {
    way.value = next;
  }
}

const file = `${DEFINITION_STYLE}.json`;

const fileSize = computed(() => {
  const size = theme.value.avatarStyleSizes?.styles?.[DEFINITION_STYLE]?.raw;

  return size ? `${Math.round(size / 1024)} kB` : '';
});

const GALLERY_ALT =
  'The style gallery of DiceBear Studio in Figma, with the DiceBear collection and a tab for your own library';
</script>

<template>
  <section class="site-box is-block is-soft home-own">
    <SiteEyebrow :face="4">Custom styles</SiteEyebrow>
    <h2 class="site-headline home-own-title">A style of your own</h2>
    <p class="site-lead home-own-lead">
      Draw it in Figma or write it by hand. Either way you end up with one file
      that works wherever DiceBear runs.
    </p>

    <div class="home-own-grid">
      <div class="site-disclosures">
        <SiteDisclosure
          name="home-own"
          size="lg"
          :die="1"
          title="Draw it in Figma"
          :open="way === 'figma'"
          @update:open="toggle('figma', $event)"
        >
          <p class="site-lead">
            One component per variant, color styles for the palettes. The plugin
            exports the frame as a style and puts real avatars into your
            mockups.
          </p>
          <div class="site-links home-own-links">
            <a :href="withBase(LINKS.studio)" class="site-link-arrow"
              >DiceBear Studio</a
            >
            <a :href="withBase(LINKS.figmaGuide)" class="site-link-arrow"
              >Guide</a
            >
          </div>
        </SiteDisclosure>
        <SiteDisclosure
          name="home-own"
          size="lg"
          :die="2"
          title="Write it by hand"
          :open="way === 'hand'"
          @update:open="toggle('hand', $event)"
        >
          <p class="site-lead">
            A style is a JSON file with a canvas, components, colors and
            animations, and no code in it. The schema is open.
          </p>
          <div class="site-links home-own-links">
            <a :href="withBase(LINKS.schema)" class="site-link-arrow"
              >Schema reference</a
            >
            <a :href="withBase(LINKS.fromScratch)" class="site-link-arrow"
              >Write one by hand</a
            >
          </div>
        </SiteDisclosure>
        <SiteDisclosure
          name="home-own"
          size="lg"
          :die="3"
          title="Use it everywhere"
          :open="way === 'use'"
          @update:open="toggle('use', $event)"
        >
          <p class="site-lead">
            One file, read everywhere. The Playground and the libraries load a
            style of your own from its definition.
          </p>
          <div class="site-links home-own-links">
            <a :href="withBase(LINKS.playground)" class="site-link-arrow"
              >Load it in the Playground</a
            >
          </div>
        </SiteDisclosure>
      </div>

      <div class="home-own-view">
        <div v-if="way === 'figma'" class="site-box is-card home-own-shot">
          <img
            class="only-light"
            :src="withBase('/studio/studio-gallery.webp')"
            :alt="GALLERY_ALT"
            width="1560"
            height="1120"
            loading="lazy"
          />
          <img
            class="only-dark"
            :src="withBase('/studio/studio-gallery-dark.webp')"
            :alt="GALLERY_ALT"
            width="1560"
            height="1120"
            loading="lazy"
          />
        </div>

        <UiCode
          v-else-if="way === 'hand'"
          lang="json"
          :code="DEFINITION_EXCERPT"
        >
          <template #label>
            <span class="home-own-file">
              <b>{{ file }}</b>
              <span v-if="fileSize">{{ fileSize }}</span>
              <span class="home-own-samples">
                <SiteAvatar
                  v-for="seed in ['Felix', 'Mia', 'Noah']"
                  :key="seed"
                  mode="library"
                  :style-name="DEFINITION_STYLE"
                  :options="{ seed }"
                  :size="36"
                  :alt="`Thumbs avatar for the seed ${seed}`"
                />
              </span>
            </span>
          </template>
        </UiCode>

        <div v-else class="site-box is-card">
          <p class="site-mono">{{ file }}</p>
          <h3 class="site-h3 home-own-readers-title">Read by</h3>
          <ul class="home-own-readers">
            <li v-for="reader in DEFINITION_READERS" :key="reader">
              <span class="site-tag">{{ reader }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-own {
  &-title {
    margin-top: 24px;
  }

  &-lead {
    max-width: 640px;
    margin-top: 28px;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
    gap: 32px clamp(32px, 4vw, 64px);
    align-items: start;
    margin-top: clamp(32px, 3.4vw, 48px);
  }

  &-links {
    margin-top: 24px;
  }

  &-view {
    min-width: 0;
  }

  /* The screenshot sits at the bottom edge of its card. */
  &-shot {
    padding-bottom: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      border-radius: 16px 16px 0 0;
      box-shadow: var(--db-shadow);
    }
  }

  &-file {
    display: flex;
    align-items: center;
    gap: 12px;

    b {
      color: var(--db-ink);
    }
  }

  &-samples {
    display: flex;
    gap: 6px;
  }

  &-readers-title {
    margin-top: 8px;
  }

  &-readers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
  }
}
</style>
