<script setup lang="ts">
defineProps<{
  url: string;
}>();
</script>

<template>
  <div class="browser">
    <div class="browser-header">
      <div class="browser-header-buttons">
        <div class="browser-header-buttons-red" />
        <div class="browser-header-buttons-yellow" />
        <div class="browser-header-buttons-green" />
      </div>
      <div class="browser-header-url">
        <a :href="url" target="_blank" rel="noopener">{{ url }}</a>
      </div>
    </div>
    <div class="browser-body">
      <a :href="url" target="_blank" rel="noopener" class="browser-body-anchor">
        <img :src="url" width="94" heigt="94" alt="preview" loading="lazy" />
      </a>
    </div>
  </div>
</template>

<style>
:root {
  --browser-preview-color: #e7e7e7;
}

.dark {
  --browser-preview-color: #3b3b3b;
}
</style>

<style lang="scss" scoped>
.browser {
  background: var(--browser-preview-color);
  padding: 12px 8px 8px;
  border-radius: 6px;
  margin: 16px 0;

  &-header {
    align-items: center;
    display: flex;
    padding-bottom: 12px;

    &-buttons {
      white-space: nowrap;
      margin: 0 8px;

      &-red,
      &-yellow,
      &-green {
        border-radius: 50%;
        display: inline-block;
        height: 12px;
        width: 12px;
        margin-right: 6px;
      }

      &-red {
        background: #f25f58;
      }

      &-yellow {
        background: #fbbe3c;
      }

      &-green {
        background: #58cb42;
      }
    }

    &-url {
      background-color: var(--vp-c-bg);
      border-radius: 6px;
      flex: 1 0;
      font-size: 12px;
      overflow: auto;
      padding: 5px 10px;
      white-space: nowrap;
      line-height: 1.6;
    }
  }

  &-body {
    background-color: var(--vp-c-bg);
    border-radius: 6px;
    padding: 16px;

    &-anchor {
      display: inline-block;
    }
  }
}
</style>
