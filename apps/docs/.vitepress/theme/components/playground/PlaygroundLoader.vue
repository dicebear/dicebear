<script setup lang="ts">
/**
 * The server-rendered stand-in for the playground: the same grid with blocks
 * where the options and the preview will be, so the page keeps its height
 * when the tool mounts.
 */
const optionRows = [76, 52, 52, 52, 52, 52, 52, 52];
const detailRows = [78, 78, 78, 56];
</script>

<template>
  <div class="pg-loader-actions" aria-hidden="true" />

  <div class="pg-loader" role="status" aria-label="Please wait...">
    <div class="pg-loader-options" aria-hidden="true">
      <span
        v-for="(height, index) in optionRows"
        :key="index"
        class="pg-loader-block"
        :style="{ height: `${height}px` }"
      />
    </div>
    <div class="pg-loader-preview" aria-hidden="true">
      <span class="pg-loader-stage" />
      <span class="pg-loader-block pg-loader-seeds" />
      <span class="pg-loader-block pg-loader-buttons" />
      <span
        v-for="(height, index) in detailRows"
        :key="index"
        class="pg-loader-row"
        :style="{ height: `${height}px` }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-loader-actions {
  height: 36px;

  @media (max-width: 767px) {
    height: 40px;
  }
}

.pg-loader {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) min(560px, 42%);
  gap: 80px;
  align-items: start;
  min-height: 1200px;

  @media (max-width: 1279px) {
    gap: 48px;
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

.pg-loader-options,
.pg-loader-preview {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pg-loader-options {
  gap: 12px;

  @media (max-width: 959px) {
    order: 2;
  }
}

.pg-loader-block,
.pg-loader-stage {
  display: block;
  border-radius: var(--db-radius-4);
  background: var(--db-soft);
  animation: pg-loader-pulse 1.6s ease-in-out infinite;
}

.pg-loader-stage {
  width: min(100%, 560px);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 32px;

  @media (max-width: 959px) {
    width: 100%;
    max-width: 560px;
    border-radius: var(--db-radius-6);
  }
}

.pg-loader-seeds {
  height: 60px;
  margin-top: 62px;
}

.pg-loader-buttons {
  height: 48px;
  margin-top: 32px;
  margin-bottom: 40px;
}

.pg-loader-row {
  display: block;
  box-sizing: border-box;
  border-top: 1px solid var(--db-line);
}

@keyframes pg-loader-pulse {
  50% {
    opacity: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pg-loader-block,
  .pg-loader-stage {
    animation: none;
  }
}
</style>
