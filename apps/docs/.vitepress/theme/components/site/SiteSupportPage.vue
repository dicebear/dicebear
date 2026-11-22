<script setup lang="ts">
/**
 * The support page: a star for the repositories on yellow, code and styles
 * on a soft block, questions on lilac, and the CDN sponsor. The prose comes
 * from the Markdown page through slots, so search and the Markdown mirror
 * read it; titles, links and the repositories live here.
 */
import { withBase } from 'vitepress';
import { siGithub } from 'simple-icons';
import UiIcon from '../ui/UiIcon.vue';
import SiteAvatar from './SiteAvatar.vue';
import SitePageHead from './SitePageHead.vue';
import SiteSection from './SiteSection.vue';

defineSlots<{
  default?: () => unknown;
  star?: () => unknown;
  code?: () => unknown;
  styles?: () => unknown;
  answer?: () => unknown;
  sponsor?: () => unknown;
}>();

const REPOS = [
  {
    name: 'dicebear/dicebear',
    text: 'The core libraries for seven languages, the CLI, this documentation site, and the editor.',
  },
  { name: 'dicebear/styles', text: 'The avatar style definitions.' },
  { name: 'dicebear/api', text: 'The self-hostable HTTP API.' },
];

const FAN = [
  { style: 'thumbs', seed: 'Felix' },
  { style: 'notionists', seed: 'Aneka' },
  { style: 'pixel-art', seed: 'Mia' },
];
</script>

<template>
  <div class="site-support">
    <SitePageHead
      :crumbs="[{ text: 'Home', link: '/' }, { text: 'Support DiceBear' }]"
      title="Support DiceBear"
      :aside-width="360"
      aside-align="end"
    >
      <slot />
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
      title="A star costs nothing"
      class="site-support-first"
    >
      <template #hint><slot name="star" /></template>
      <div class="site-rows is-strong">
        <a
          v-for="repo in REPOS"
          :key="repo.name"
          :href="`https://github.com/${repo.name}`"
          target="_blank"
          rel="noopener noreferrer"
          class="site-row site-support-repo"
        >
          <span class="site-support-repo-name">
            <UiIcon :path="siGithub.path" :size="24" aria-hidden="true" />
            {{ repo.name }}
          </span>
          <span class="site-body site-support-repo-text">{{ repo.text }}</span>
          <span class="site-btn site-btn-primary">
            Star
            <span class="sr-only">{{ repo.name }} on GitHub</span>
          </span>
        </a>
      </div>
    </SiteSection>

    <SiteSection tone="soft" layout="stack" title="Code and styles are welcome">
      <div class="site-grid site-support-cards">
        <div class="site-box is-tile">
          <h3 class="site-h3">Code</h3>
          <div class="site-body site-support-text"><slot name="code" /></div>
          <div class="site-links site-support-links">
            <a href="/contribute/library/" class="site-link-arrow"
              >Contribute to the library</a
            >
          </div>
        </div>
        <div class="site-box is-tile">
          <h3 class="site-h3">Avatar styles</h3>
          <div class="site-body site-support-text"><slot name="styles" /></div>
          <div class="site-links site-support-links">
            <a href="/create-styles/with-figma/" class="site-link-arrow"
              >With Figma</a
            >
            <a href="/create-styles/from-scratch/" class="site-link-arrow"
              >From scratch</a
            >
          </div>
        </div>
      </div>
    </SiteSection>

    <SiteSection tone="lilac" layout="stack" title="Answer a question">
      <template #hint><slot name="answer" /></template>
      <template #aside>
        <a
          href="https://github.com/dicebear/dicebear/discussions"
          target="_blank"
          rel="noopener noreferrer"
          class="site-link-arrow"
          >GitHub Discussions</a
        >
      </template>
    </SiteSection>

    <section class="site-box is-block is-ring site-support-sponsor">
      <div class="site-support-sponsor-main">
        <h2 class="site-headline">Sponsored by bunny.net</h2>
        <div class="site-lead site-support-sponsor-lead">
          <slot name="sponsor" />
        </div>
        <a
          href="https://bunny.net/"
          target="_blank"
          rel="noopener sponsored"
          class="site-link-arrow site-support-sponsor-link"
          >Visit bunny.net</a
        >
      </div>
      <div class="site-support-sponsor-logo">
        <a
          href="https://bunny.net/"
          target="_blank"
          rel="noopener sponsored"
          aria-label="bunny.net"
        >
          <img
            class="only-light"
            :src="withBase('/sponsors/bunny-dark.svg')"
            alt="bunny.net"
            width="149"
            height="43"
          />
          <img
            class="only-dark"
            :src="withBase('/sponsors/bunny-light.svg')"
            alt="bunny.net"
            width="149"
            height="43"
          />
        </a>
        <p class="site-small">Advertisement</p>
      </div>
    </section>
    <div class="site-end"></div>
  </div>
</template>

<style scoped lang="scss">
.site-support {
  &-first {
    margin-top: clamp(40px, 5vw, 72px);
  }

  /* A repository: its name, what is in it, and the star button. The whole
     row is the link. */
  &-repo {
    gap: 8px 24px;
    padding: 20px 0;

    .is-strong > & {
      padding: 20px 0;
    }

    &-name {
      display: flex;
      flex: 0 1 300px;
      align-items: center;
      gap: 12px;
      font-family: var(--db-font-display);
      font-size: clamp(20px, 2vw, 26px);
      line-height: 1.2;
      font-weight: 700;
    }

    &-text {
      flex: 1 1 320px;
    }

    &:hover &-name {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 5px;
    }
  }

  &-cards {
    --site-grid-min: 380px;
  }

  &-text {
    max-width: 520px;
    margin-top: 10px;

    :deep(p) {
      margin: 0;
    }
  }

  &-links {
    margin-top: 16px;
  }

  &-sponsor {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 32px clamp(40px, 5vw, 88px);

    &-main {
      flex: 1 1 360px;
    }

    &-lead {
      max-width: 560px;
      margin-top: 28px;
    }

    &-link {
      margin-top: 20px;
    }

    &-logo {
      display: flex;
      flex: 0 1 360px;
      flex-direction: column;
      gap: 12px;

      img {
        width: min(320px, 100%);
        height: auto;
      }
    }
  }
}
</style>
