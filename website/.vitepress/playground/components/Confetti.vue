<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import confetti from 'canvas-confetti';

const canvas = ref<HTMLCanvasElement>();
const instance = computed(() => {
  return canvas.value
    ? confetti.create(canvas.value, {
        resize: true,
        disableForReducedMotion: true,
      })
    : undefined;
});

watchEffect(() => {
  if (instance.value) {
    instance.value({
      particleCount: 35,
      angle: 60,
      spread: 40,
      startVelocity: 35,
      origin: { x: -0.1, y: 0.8 },
    });

    instance.value({
      particleCount: 35,
      angle: 120,
      spread: 40,
      startVelocity: 35,
      origin: { x: 1.1, y: 0.8 },
    });
  }
});
</script>

<template>
  <canvas ref="canvas" class="confetti"></canvas>
</template>

<style scoped>
.confetti {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
