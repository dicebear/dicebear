<script setup lang="ts">
/**
 * Light and dark. Both icons are in the markup and CSS shows the one that
 * fits, because the server cannot know the reader's theme.
 */
import { onMounted, ref } from 'vue';
import { useData } from 'vitepress';
import { Moon, Sun } from '@lucide/vue';

const { isDark } = useData();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

function toggle() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <button
    type="button"
    role="switch"
    class="theme-switch"
    :aria-checked="mounted ? isDark : false"
    aria-label="Dark theme"
    @click="toggle"
  >
    <span class="theme-switch-knob">
      <Sun
        class="theme-switch-sun"
        :size="16"
        :stroke-width="2.5"
        aria-hidden="true"
      />
      <Moon
        class="theme-switch-moon"
        :size="15"
        :stroke-width="2.5"
        aria-hidden="true"
      />
    </span>
  </button>
</template>

<style lang="scss" scoped>
/* The large switch of the set (SiteSwitch md), with the sun or the moon on
   its knob. */
.theme-switch {
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 44px;
  border: 1px solid var(--db-field-border);
  border-radius: 22px;
  background: var(--db-soft);
  transition: border-color 0.12s;

  &:hover {
    border-color: var(--db-ink-2);
  }
}

.theme-switch-knob {
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--db-ink);
  color: var(--db-paper);
  transition: transform var(--duration-fast) var(--ease-smooth);
}

.theme-switch-moon {
  display: none;
}

.dark .theme-switch-knob {
  transform: translateX(28px);
}

.dark .theme-switch-sun {
  display: none;
}

.dark .theme-switch-moon {
  display: block;
}
</style>
