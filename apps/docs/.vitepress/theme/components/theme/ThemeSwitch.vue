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
/** Only a switch by hand moves the knob, not the first paint. */
const moved = ref(false);

onMounted(() => {
  mounted.value = true;
});

function toggle() {
  moved.value = true;
  isDark.value = !isDark.value;
}
</script>

<template>
  <button
    type="button"
    role="switch"
    class="theme-switch"
    :class="{ 'is-moved': moved }"
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

/* VitePress turns transitions off for the moment the theme changes, so the
   knob slides and the icon turns in with animations instead. */
.is-moved .theme-switch-knob {
  animation: theme-switch-off 0.35s var(--ease-spring);
}

.dark .is-moved .theme-switch-knob {
  animation-name: theme-switch-on;
}

.is-moved :is(.theme-switch-sun, .theme-switch-moon) {
  animation: theme-switch-icon 0.45s var(--ease-spring);
}

@keyframes theme-switch-on {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(28px);
  }
}

@keyframes theme-switch-off {
  from {
    transform: translateX(28px);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes theme-switch-icon {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.4);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>
