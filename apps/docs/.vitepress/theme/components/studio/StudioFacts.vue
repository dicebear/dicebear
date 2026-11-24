<script setup lang="ts">
/** Short facts about the plugin as the shared fact list. */
interface StudioFact {
  term: string;
  text: string;
}

const facts: StudioFact[] = [
  { term: 'Free', text: 'Works in the Figma desktop app and in the browser.' },
  {
    term: 'Private',
    text: 'The avatars render inside the plugin, so no seed leaves Figma.',
  },
  {
    term: 'Offline',
    text: 'Definitions you have used stay cached in Figma and render without a connection.',
  },
  {
    term: 'One host',
    text: 'The collection and its previews come from api.dicebear.com. The plugin talks to nothing else.',
  },
  { term: 'Open source', text: 'MIT licensed, with the source on GitHub.' },
];
</script>

<template>
  <dl class="site-facts">
    <div v-for="fact in facts" :key="fact.term" class="site-fact">
      <dt>{{ fact.term }}</dt>
      <dd>{{ fact.text }}</dd>
    </div>
  </dl>
</template>
