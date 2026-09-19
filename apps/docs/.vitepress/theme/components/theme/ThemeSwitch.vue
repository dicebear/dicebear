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
    class="theme-switch hv-border"
    :aria-checked="mounted ? isDark : false"
    aria-label="Dark theme"
    @click="toggle"
  >
    <span class="theme-switch-knob">
      <Sun
        class="theme-switch-sun"
        :size="12"
        :stroke-width="2.5"
        aria-hidden="true"
      />
      <Moon
        class="theme-switch-moon"
        :size="11"
        :stroke-width="2.5"
        aria-hidden="true"
      />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.theme-switch {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  border: 1px solid var(--db-switch-border);
  border-radius: 11px;
  background: var(--db-switch-bg);
}

.theme-switch-knob {
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--db-knob);
  box-shadow: 0 1px 2px rgba(11, 22, 32, 0.25);
  color: var(--db-muted);
  transition: transform var(--duration-fast) var(--ease-smooth);
}

.theme-switch-moon {
  display: none;
}

.dark .theme-switch-knob {
  transform: translateX(18px);
  color: var(--db-btn-fg);
}

.dark .theme-switch-sun {
  display: none;
}

.dark .theme-switch-moon {
  display: block;
}
</style>
