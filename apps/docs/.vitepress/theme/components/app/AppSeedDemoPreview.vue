<script setup lang="ts">
import { computed } from 'vue';
import { Dice5 } from '@lucide/vue';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { UiAvatar, UiStyleSelect } from '../ui';

defineProps<{
  styles: string[];
}>();

const seed = defineModel<string>({ required: true });
const styleName = defineModel<string>('styleName', { required: true });

const emit = defineEmits<{
  randomizeSeed: [];
}>();

const mainAvatarLink = computed(
  () =>
    `https://api.dicebear.com/11.x/${styleName.value}/svg?seed=${encodeURIComponent(seed.value)}`,
);
</script>

<template>
  <div class="app-seed-demo-showcase">
    <div class="app-seed-demo-avatar-stage">
      <div class="app-seed-demo-avatar-glow"></div>
      <a :href="mainAvatarLink" target="_blank" rel="noopener">
        <UiAvatar
          :style-name="styleName"
          :style-options="{ seed, size: 256 }"
          alt="Avatar preview"
          class="app-seed-demo-avatar-main"
          mode="library"
        />
      </a>
    </div>

    <UiStyleSelect
      v-model="styleName"
      :styles="styles"
      :seed="seed"
      :value-avatar-size="20"
      aria-label="Avatar style"
      class="app-seed-demo-control"
    />

    <IconField class="app-seed-demo-control app-seed-demo-seed-field">
      <InputText
        id="app-seed-demo-seed"
        v-model="seed"
        placeholder="Seed"
        aria-label="Seed"
        spellcheck="false"
        autocomplete="off"
      />
      <InputIcon
        class="app-seed-demo-dice-icon"
        role="button"
        tabindex="0"
        aria-label="Next seed"
        title="Next seed"
        @click="emit('randomizeSeed')"
        @keydown.enter.prevent="emit('randomizeSeed')"
        @keydown.space.prevent="emit('randomizeSeed')"
      >
        <Dice5 :size="16" />
      </InputIcon>
    </IconField>
  </div>
</template>
