<script setup lang="ts">
import ClientOnly from '@theme/components/ClientOnly.vue';
import Loader from './components/Loader.vue';
import Preview from './components/Preview.vue';
import { all as catNames } from 'cat-names';

const names = [...catNames].sort(() => 0.5 - Math.random()).slice(0, 20);
</script>

<template>
  <ClientOnly>
    <template #default>
      <form autoComplete="off" @submit.prevent>
        <div class="app">
          <Preview v-for="name in names" :name="name" />
        </div>
      </form>
    </template>
    <template #fallback>
      <Loader />
    </template>
  </ClientOnly>
</template>

<style scoped lang="scss">
.app {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 60px 30px;
}
</style>
