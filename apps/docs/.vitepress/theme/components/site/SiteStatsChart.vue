<script setup lang="ts">
/**
 * One bar per week. Every bar is in the brand color, and the bar under the
 * pointer turns to ink while the tooltip names its week and value.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { useChartTheme } from '@theme/composables/useChartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const props = defineProps<{
  labels: string[];
  values: number[];
  formatValue: (value: number) => string;
}>();

const { isDark } = useData();
const { chartKey, tooltipConfig, gridColor, tickColor } = useChartTheme();

// The canvas cannot read custom properties, so these repeat `--db-brand`
// and `--db-ink` for both themes.
const colors = computed(() =>
  isDark.value
    ? { bar: '#4cb3e6', hover: '#e6edf3' }
    : { bar: '#0284c7', hover: '#0b1620' },
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: colors.value.bar,
      hoverBackgroundColor: colors.value.hover,
      borderRadius: { topLeft: 3, topRight: 3 },
      borderSkipped: false as const,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
    },
  ],
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
      display: false,
    },
    tooltip: {
      ...tooltipConfig(),
      displayColors: false,
      callbacks: {
        label: (ctx: any) => props.formatValue(ctx.parsed.y),
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: tickColor(0.6),
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8,
        font: { size: 13 },
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
        color: tickColor(0.6),
        maxTicksLimit: 5,
        callback: (value: any) => props.formatValue(value),
        font: { size: 13 },
      },
      border: {
        display: false,
      },
    },
  },
}));
</script>

<template>
  <div class="site-stats-chart">
    <Bar :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style lang="scss" scoped>
.site-stats-chart {
  position: relative;
  height: 352px;

  @media (max-width: 767px) {
    height: 240px;
  }
}
</style>
