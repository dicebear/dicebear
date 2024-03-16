<script setup lang="ts">
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import randomItem from 'random-item';
import { all as nameList } from 'cat-names';
import { paramCase } from 'change-case';
import Prando from 'prando';
import randomInt from 'random-int';

const GRADIENTS = [
  // MIT License - Copyright (c) 2017 Webkul
  // https://github.com/webkul/coolhue/blob/master/LICENSE
  'linear-gradient(135deg, #FDEB71 10%, #F8D800 100%)',
  'linear-gradient(135deg, #ABDCFF 10%, #0396FF 100%)',
  'linear-gradient(135deg, #FEB692 10%, #EA5455 100%)',
  'linear-gradient(135deg, #CE9FFC 10%, #7367F0 100%)',
  'linear-gradient(135deg, #90F7EC 10%, #32CCBC 100%)',
  'linear-gradient(135deg, #81FBB8 10%, #28C76F 100%)',
  'linear-gradient(135deg, #E2B0FF 10%, #9F44D3 100%)',
];

const prng = new Prando(123);

const { theme } = useData<ThemeOptions>();
const avatarStyleList = computed(() => Object.keys(theme.value.avatarStyles));
const avatarList = ref(Array.from({ length: 26 }, () => createAvatar()));
const avatarTimeout = ref();

const lastAvatarIndex = ref(0);
const nextAvatar = ref(createAvatar());

watchEffect(() => {
  // Preload image
  const image = new Image();
  image.src = nextAvatar.value.src;
});

function createAvatar() {
  const avatarStyle = paramCase(prng.nextArrayItem(avatarStyleList.value));
  const seed = encodeURIComponent(prng.nextArrayItem(nameList as string[]));

  return {
    src: `https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${seed}`,
    gradient: randomItem(GRADIENTS),
  };
}

function updateAvatar() {
  avatarTimeout.value = setTimeout(() => {
    let index = 0;

    while (
      lastAvatarIndex.value === index ||
      [0, 4, 5, 10, 15, 20, 21, 25].includes(index)
    ) {
      index = randomInt(0, 25);
    }

    lastAvatarIndex.value = index;
    avatarList.value[index] = nextAvatar.value;
    nextAvatar.value = createAvatar();

    updateAvatar();
  }, 1000);
}

onMounted(() => updateAvatar());
onUnmounted(() => clearTimeout(avatarTimeout.value));
</script>

<template>
  <div class="wrapper">
    <div class="col col-logo">
      <img src="/logo-home.svg" class="image" />
    </div>
    <div
      v-for="(avatar, key) in avatarList"
      :key="key"
      class="col"
      :style="{ order: key * 2 }"
    >
      <Transition>
        <img
          :key="avatar.src"
          :src="avatar.src"
          :style="{ background: avatar.gradient }"
          class="image"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: inline-flex;
  overflow: hidden;
  flex-wrap: wrap;
  aspect-ratio: 1/1;
  width: 100%;
  max-width: 510px;
  margin-left: auto;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='750' height='750' viewBox='0 0 750 750' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_f_111_2)'%3E%3Crect x='180' y='180' width='390' height='390' rx='100' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_111_2' x='0' y='0' width='750' height='750' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='57.5' result='effect1_foregroundBlur_111_2'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A");
  mask-image: url("data:image/svg+xml,%3Csvg width='750' height='750' viewBox='0 0 750 750' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_f_111_2)'%3E%3Crect x='180' y='180' width='390' height='390' rx='100' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_111_2' x='0' y='0' width='750' height='750' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='57.5' result='effect1_foregroundBlur_111_2'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E%0A");
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  margin: -12px;
  align-content: center;
}

.col {
  position: relative;
  flex: 0 0 auto;
  width: calc(100% / 5);
  aspect-ratio: 1/1;
  padding: 6px;
}

.col:nth-child(n + 7) {
  width: calc(100% / 6);
}

.col:nth-child(n + 13) {
  width: calc(100% / 5);
}

.col:nth-child(n + 17) {
  width: calc(100% / 6);
}

.col:nth-child(n + 23) {
  width: calc(100% / 5);
}

.col-logo {
  order: 25;
}

.image {
  display: block;
  position: absolute;
  top: 6px;
  right: 6px;
  bottom: 6px;
  left: 6px;
  border-radius: 10px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.75s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
