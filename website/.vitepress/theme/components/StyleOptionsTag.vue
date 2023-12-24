<script setup lang="ts">
defineProps<{
  name: string;
  value: unknown;
}>();
</script>

<template>
  <v-chip class="tag">
    {{ name }}
    <code>{{ value }}</code>
  </v-chip>
</template>

<style scoped lang="scss">
.tag {
  display: inline-flex;
  align-items: center;
  padding-right: 0;
  border-radius: 6px;
  margin-right: 16px;
  height: 32px;

  code {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    line-height: 20px;
    margin-left: 12px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 14px;
  }
}
</style>
