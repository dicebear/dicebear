<script setup lang="ts">
/** Short facts about the plugin as a hairline list: term left, text right. */
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
  <dl class="studio-facts">
    <div v-for="fact in facts" :key="fact.term" class="studio-facts-row">
      <dt class="studio-facts-term">{{ fact.term }}</dt>
      <dd class="site-body">{{ fact.text }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.studio-facts {
  display: flex;
  flex-direction: column;
  margin: 0;
  border-bottom: 1px solid var(--db-line);

  &-row {
    display: grid;
    grid-template-columns: 400px minmax(0, 1fr);
    gap: 80px;
    padding: 24px 0;
    border-top: 1px solid var(--db-line);
  }

  &-term {
    font-size: 20px;
    line-height: 32px;
    font-weight: 700;
    color: var(--db-ink);
  }

  @media (max-width: 1199px) {
    &-row {
      grid-template-columns: 320px minmax(0, 1fr);
      gap: 48px;
    }
  }

  @media (max-width: 959px) {
    &-row {
      grid-template-columns: 160px minmax(0, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 767px) {
    &-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 4px;
      padding: 20px 0;
    }

    &-term {
      font-size: 16px;
      line-height: 26px;
    }
  }
}
</style>
