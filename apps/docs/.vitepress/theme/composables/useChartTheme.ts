import { computed } from 'vue';
import { useData } from 'vitepress';

export function useChartTheme() {
  const { isDark } = useData();

  // Flips when the theme toggles; chart components bind it as `:key` to force a
  // Chart.js remount so new theme colors take effect.
  const chartKey = computed(() => (isDark.value ? 1 : 0));

  function tooltipConfig() {
    return {
      // A canvas cannot read custom properties, so these repeat the tokens
      // panel, muted, ink and line.
      backgroundColor: isDark.value ? '#121c25' : '#ffffff',
      titleColor: isDark.value ? '#8595a3' : '#5f6d79',
      bodyColor: isDark.value ? '#e6edf3' : '#0b1620',
      borderColor: isDark.value ? '#1e2a35' : '#e4e9ed',
      borderWidth: 1,
      padding: 12,
    };
  }

  function gridColor() {
    return isDark.value ? '#1e2a35' : '#e4e9ed';
  }

  function tickColor(opacity = 1) {
    return isDark.value
      ? `rgba(133,149,163,${opacity})`
      : `rgba(95,109,121,${opacity})`;
  }

  return { chartKey, tooltipConfig, gridColor, tickColor };
}
