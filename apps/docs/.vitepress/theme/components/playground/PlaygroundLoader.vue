<script setup lang="ts">
/**
 * The server-rendered stand-in for the playground: the toolbar, the three
 * columns and the picture, so the page keeps its shape until the tool mounts.
 */
const entryRows = [24, 44, 44, 44, 24, 44, 44, 44, 44, 44, 24, 44, 44];
</script>

<template>
  <div class="pg-loader" role="status" aria-label="Please wait...">
    <div class="pg-loader-toolbar" aria-hidden="true">
      <div class="pg-loader-toolbar-inner">
        <div class="pg-loader-toolbar-grid">
          <span class="pg-loader-block" style="width: 38px" />
          <span class="pg-loader-block" style="width: 104px" />
          <span class="pg-loader-block pg-loader-style" />
          <span class="pg-loader-block" style="width: 84px" />
        </div>
      </div>
    </div>
    <div class="pg-loader-body" aria-hidden="true">
      <div class="pg-loader-entries">
        <span
          v-for="(height, index) in entryRows"
          :key="index"
          class="pg-loader-block"
          :style="{
            height: `${height}px`,
            width: height === 24 ? '40%' : '100%',
          }"
        />
      </div>
      <div class="pg-loader-stage">
        <span class="pg-loader-picture" />
        <span class="pg-loader-block pg-loader-seed" />
      </div>
      <div class="pg-loader-inspector">
        <span class="pg-loader-block" style="height: 24px; width: 50%" />
        <span class="pg-loader-block" style="height: 40px" />
        <span class="pg-loader-block" style="height: 160px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-loader {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-block {
    display: block;
    box-sizing: border-box;
    border-radius: var(--db-radius-2);
    background: var(--db-soft);
  }

  &-container {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--db-container);
    margin: 0 auto;
    padding: 0 var(--db-gutter);

    @media (min-width: 960px) {
      padding: 0 calc(var(--db-gutter) - 12px);
    }
  }

  &-toolbar {
    flex-shrink: 0;
    height: 56px;
    border-bottom: 1px solid var(--db-line);

    &-inner {
      @extend .pg-loader-container;

      height: 100%;
    }

    &-grid {
      display: flex;
      align-items: center;
      gap: 8px;
      box-sizing: border-box;
      height: 100%;
      padding: 0 12px;
    }

    .pg-loader-block {
      height: 40px;
    }
  }

  @media (max-width: 959px) {
    &-toolbar-grid {
      padding: 0;
    }
  }

  &-style {
    width: 300px;
    margin: 0 auto;
  }

  & &-seed {
    width: min(100%, 52vh, 480px);
    height: 40px;
  }

  &-body {
    @extend .pg-loader-container;

    display: grid;
    flex: 1;
    grid-template-columns: 260px minmax(0, 1fr) 360px;
    min-height: 0;
  }

  &-entries,
  &-inspector {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px 12px;
  }

  &-entries {
    border-right: 1px solid var(--db-line);
  }

  &-inspector {
    border-left: 1px solid var(--db-line);
  }

  &-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
  }

  &-picture {
    display: block;
    width: min(100%, 60vh, 560px);
    aspect-ratio: 1 / 1;
    border-radius: var(--db-radius-6);
    background: var(--db-soft);
  }

  @media (max-width: 959px) {
    &-body {
      display: flex;
      flex-direction: column;
      max-width: none;
      padding: 0;
    }

    &-entries,
    &-inspector {
      display: none;
    }

    &-style {
      display: none;
    }
  }
}
</style>
