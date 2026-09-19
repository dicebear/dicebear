<script setup lang="ts">
/** Ways to give something back. The rows look like those in AboutOpenSource. */
import AboutSection from './AboutSection.vue';
import AboutRows, { type AboutRow } from './AboutRows.vue';

const rows: AboutRow[] = [
  {
    title: 'Report and fix',
    text: 'Bug reports and pull requests are welcome in every repository.',
    link: 'Contribute',
    href: '/contribute/library/',
  },
  {
    title: 'Draw a style',
    text: 'New avatar styles are the contribution people notice most.',
    link: 'Style guides',
    href: '/create-styles/with-figma/',
  },
  {
    title: 'Help others',
    text: 'Answer questions from people who use DiceBear.',
    link: 'GitHub',
    href: 'https://github.com/dicebear/dicebear/discussions',
  },
];
</script>

<template>
  <AboutSection :title="['Give something back']">
    <AboutRows :rows="rows" />
  </AboutSection>
</template>
