<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useChartTheme } from '../../composables/useChartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const props = defineProps<{
  labels: string[];
  series: Array<{ name: string; values: number[] }>;
  formatValue: (value: number) => string;
}>();

// Generate one distinct color per series so the palette never repeats, even
// with all 36+ styles. Golden-angle hue spacing (137.5°) keeps adjacent lines
// far apart on the color wheel; starting near the brand-blue hue keeps the
// first (top) series on-brand. Alternating lightness adds extra separation.
const palette = computed(() =>
  props.series.map((_, i) => {
    const hue = (i * 137.508 + 205) % 360;
    const lightness = i % 2 === 0 ? 58 : 46;
    return `hsl(${hue.toFixed(1)} 65% ${lightness}%)`;
  }),
);

const { chartKey, tooltipConfig, gridColor, tickColor } = useChartTheme();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.series.map((s, i) => {
    const color = palette.value[i];

    return {
      label: s.name,
      data: s.values,
      borderColor: color,
      backgroundColor: color,
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 10,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: color,
    };
  }),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        color: tickColor(),
        boxWidth: 12,
        boxHeight: 12,
        padding: 12,
        font: { size: 12 },
      },
    },
    tooltip: {
      ...tooltipConfig(),
      callbacks: {
        label: (ctx: any) =>
          `${ctx.dataset.label}: ${props.formatValue(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: tickColor(),
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8,
        font: { size: 12 },
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: gridColor(),
      },
      ticks: {
        color: tickColor(),
        callback: (value: any) => props.formatValue(value),
        font: { size: 12 },
      },
      border: {
        display: false,
      },
    },
  },
}));
</script>

<template>
  <div class="app-stats-multi-line-chart">
    <Line :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style lang="scss" scoped>
.app-stats-multi-line-chart {
  height: 360px;
  position: relative;
}

@media (max-width: 640px) {
  .app-stats-multi-line-chart {
    height: 280px;
  }
}
</style>
