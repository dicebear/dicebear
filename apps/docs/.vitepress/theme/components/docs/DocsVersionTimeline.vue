<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  axisFraction,
  axisFractionOf,
  formatDate,
  stateLabels,
  supportTracks,
  timelineYears,
  type Phase,
  type VersionLine,
} from '@theme/config/versionSupport';

/**
 * The marker for today is set after mounting on purpose. The pages are
 * pre-rendered, so a date read during SSR is the day of the build, and the
 * two positions would disagree at hydration.
 */
const props = defineProps<{
  /** `key` of the track in versionSupport.ts, one chart per mount. */
  track: string;
}>();

const track = computed(() => {
  const found = supportTracks.find((entry) => entry.key === props.track);

  if (!found) {
    throw new Error(`Unknown version track "${props.track}"`);
  }

  return found;
});

const today = ref<number | undefined>();

onMounted(() => {
  today.value = Date.now();
});

const todayOffset = computed(() =>
  today.value === undefined ? undefined : axisFractionOf(today.value),
);

function segment(phase: Phase) {
  const left = axisFraction(phase.from);
  const right = phase.until ? axisFraction(phase.until) : 1;

  return {
    left: `${left * 100}%`,
    width: `${Math.max(right - left, 0.012) * 100}%`,
  };
}

function lineTitle(line: VersionLine): string {
  const phases = line.phases.map((phase) => {
    const period = phase.until
      ? `${formatDate(phase.from)} to ${formatDate(phase.until)}`
      : `since ${formatDate(phase.from)}`;

    return `${stateLabels[phase.state].toLowerCase()} ${period}`;
  });

  return `${line.version}: ${phases.join(', ')}`;
}
</script>

<template>
  <div class="vt">
    <div class="vt-scroll" aria-hidden="true">
      <div
        class="vt-chart"
        :style="
          todayOffset === undefined ? undefined : { '--vt-today': todayOffset }
        "
      >
        <p class="vt-legend">
          <span
            v-for="entry in track.legend"
            :key="entry.state"
            :class="`is-${entry.state}`"
            >{{ entry.label }}</span
          >
        </p>

        <div class="vt-axis">
          <div />
          <div class="vt-axis-lane">
            <span
              v-for="(year, index) in timelineYears"
              :key="year"
              class="vt-axis-year"
              :style="{ left: `${(index / timelineYears.length) * 100}%` }"
              >{{ year }}</span
            >
          </div>
        </div>

        <div v-if="todayOffset !== undefined" class="vt-today" />

        <div
          v-for="line in track.lines"
          :key="line.version"
          class="vt-row"
          :class="`is-${line.state}`"
        >
          <div class="vt-label">
            <strong>{{ line.version }}</strong>
            <span>{{ stateLabels[line.state] }}</span>
          </div>
          <div class="vt-lane" :title="lineTitle(line)">
            <div
              v-for="(phase, index) in line.phases"
              :key="phase.from"
              class="vt-bar"
              :class="[
                `is-${phase.state}`,
                {
                  'is-first': index === 0,
                  'is-last': index === line.phases.length - 1,
                  'is-open': !phase.until,
                },
              ]"
              :style="segment(phase)"
            />
          </div>
        </div>

        <div v-if="todayOffset !== undefined" class="vt-axis vt-foot">
          <div />
          <div class="vt-axis-lane">
            <span
              class="vt-axis-today"
              :style="{ left: `${todayOffset * 100}%` }"
              >Today</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="vt-table">
      <div class="vt-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Version</th>
              <th>Released</th>
              <th>Status</th>
              <th>Support</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="line in track.lines"
              :key="line.version"
              :class="`is-${line.state}`"
            >
              <td>
                <code>{{ line.version }}</code>
              </td>
              <td class="vt-cell-date">{{ formatDate(line.released) }}</td>
              <td class="vt-cell-state">{{ stateLabels[line.state] }}</td>
              <td>{{ line.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vt {
  margin: 24px 0;
}

.vt-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--ui-window-border-color);
  border-radius: var(--vp-radius-md, 16px);
  background: var(--ui-window-bg);
}

.vt-chart {
  position: relative;
  min-width: 620px;
  padding: 20px 24px 20px;

  // Width of the label column plus the gap to the lanes. The marker for today
  // spans the full height of the chart, so it cannot sit inside a lane and
  // has to redo that offset itself.
  --vt-gutter: 8rem;
}

.vt-row,
.vt-axis {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  align-items: center;
}

.vt-axis {
  height: 20px;
}

.vt-foot {
  margin-top: 8px;
}

.vt-axis-lane {
  position: relative;
  height: 20px;
}

.vt-axis-year,
.vt-axis-today {
  position: absolute;
  top: 0;
  font-size: 12px;
  line-height: 20px;
  color: var(--ui-c-text-subtle);
  transform: translateX(-50%);
  white-space: nowrap;
}

.vt-axis-today {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

// A hairline through every lane, so a bar can be read against the years
// without following it back to the axis.
.vt-today {
  position: absolute;
  top: 58px;
  bottom: 40px;
  left: calc(
    24px + var(--vt-gutter) + (100% - 48px - var(--vt-gutter)) * var(--vt-today)
  );
  width: 1px;
  background: var(--vp-c-text-1);
  opacity: 0.35;
}

.vt-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px 14px;
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--ui-c-text-subtle);

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  span::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--vt-fill);
  }
}

.vt-row {
  height: 30px;
}

.vt-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 13px;

  strong {
    font-weight: 600;
  }

  span {
    font-size: 11px;
    color: var(--vt-text);
    white-space: nowrap;
  }
}

.vt-lane {
  position: relative;
  height: 100%;

  // The year grid. Every year has the same width (see axisFraction), so a
  // repeating gradient lands on the same lines the axis labels use.
  background-image: repeating-linear-gradient(
    to right,
    var(--vp-c-divider) 0 1px,
    transparent 1px calc(100% / 6)
  );
  background-position: 0 0;
}

// Two colors across both tracks, shared by the bars and the legend swatches:
// green while a version gets everything, yellow once it is winding down.
.vt-bar,
.vt-legend span {
  &.is-maintained,
  &.is-served {
    --vt-fill: var(--vp-c-green-2);
  }

  &.is-security,
  &.is-deprecated {
    --vt-fill: var(--vp-c-yellow-2);
  }
}

.vt-bar {
  position: absolute;
  top: 6px;
  bottom: 6px;
  background: var(--vt-fill);
}

.vt-bar.is-first {
  border-top-left-radius: 999px;
  border-bottom-left-radius: 999px;
}

.vt-bar.is-last {
  border-top-right-radius: 999px;
  border-bottom-right-radius: 999px;
}

// An open phase runs off the right edge instead of ending on a date.
.vt-bar.is-open {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  -webkit-mask-image: linear-gradient(to right, #000 82%, transparent);
  mask-image: linear-gradient(to right, #000 82%, transparent);
}

// The status word next to a row and in the table takes the text variant of
// the color its current phase carries.
.vt-row,
.vt-table tr {
  --vt-text: var(--ui-c-text-subtle);

  &.is-maintained,
  &.is-served {
    --vt-text: var(--vp-c-green-1);
  }

  &.is-security,
  &.is-deprecated {
    --vt-text: var(--vp-c-yellow-1);
  }
}

.vt-table {
  margin-top: 16px;

  table {
    display: table;
    width: 100%;
    min-width: 460px;
    margin: 0;
  }

  td,
  th {
    font-size: 14px;
  }
}

.vt-table .vt-cell-state {
  color: var(--vt-text);
  white-space: nowrap;
}

.vt-table .vt-cell-date {
  white-space: nowrap;
}

.vt-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
