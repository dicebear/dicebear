<script setup lang="ts">
/**
 * Who is behind DiceBear and what someone can rely on. The last row counts
 * the websites of the latest complete week, which arrives with the
 * statistics after the page has mounted.
 */
import { computed } from 'vue';
import { siGithub } from 'simple-icons';
import UiIcon from '@theme/components/ui/UiIcon.vue';
import { useApiStatsRaw } from '@theme/composables/useApiStats';
import AboutSection from './AboutSection.vue';
import AboutRows, { type AboutRow } from './AboutRows.vue';

const WEBSITES_STEP = 10_000;

const stats = useApiStatsRaw();

const realUse = computed(() => {
  const referers = stats.value?.weekly?.referers;
  const week = referers ? Object.keys(referers).sort().at(-1) : undefined;
  const count = week && referers ? referers[week] : 0;

  if (!week || count < WEBSITES_STEP) {
    return 'Websites request avatars from the hosted API every week.';
  }

  const floor = Math.floor(count / WEBSITES_STEP) * WEBSITES_STEP;
  const day = new Date(`${week}T00:00:00Z`).toLocaleDateString('en', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return `More than ${floor.toLocaleString('en')} websites requested avatars in the week of ${day}.`;
});

const rows = computed<AboutRow[]>(() => [
  {
    title: 'Licenses per style',
    text: 'Each style keeps the license its artist chose, and the overview lists every one of them.',
    link: 'See the licenses',
    href: '/licenses/',
  },
  {
    title: "Your users' data",
    text: 'The libraries run in your own code, so no data about your users leaves your systems.',
    link: 'How it works',
    href: '/understand/how-avatars-are-made/',
  },
  {
    title: 'Your own API',
    text: 'The HTTP API is open source as well. Host it yourself and keep the URL-based workflow.',
    link: 'dicebear/api',
    href: 'https://github.com/dicebear/api',
  },
  {
    title: 'A free hosted API',
    text: 'bunny.net sponsors the CDN behind the hosted API, so it stays free of charge.',
    link: 'Visit bunny.net',
    href: 'https://bunny.net/',
    sponsored: true,
  },
  {
    title: 'Real use',
    text: realUse.value,
    link: 'See the statistics',
    href: '/stats/',
  },
]);
</script>

<template>
  <AboutSection
    :title="['No paid tier', 'No company behind it']"
    lead="DiceBear is MIT licensed and built in the open. Bug reports, pull requests and new styles are welcome."
  >
    <template #actions>
      <a
        class="site-btn site-btn-lg site-btn-primary"
        href="https://github.com/dicebear/dicebear"
        target="_blank"
        rel="noopener noreferrer"
      >
        <UiIcon :path="siGithub.path" :size="20" aria-hidden="true" />
        DiceBear on GitHub
      </a>
      <a
        class="site-btn site-btn-lg site-btn-secondary"
        href="/contribute/library/"
      >
        How to contribute
      </a>
    </template>
    <AboutRows :rows="rows" />
  </AboutSection>
</template>
