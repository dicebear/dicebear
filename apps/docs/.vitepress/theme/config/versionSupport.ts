/**
 * Which DiceBear versions are still supported.
 *
 * Two tracks that age differently, which is the whole reason the page exists:
 * a library line stops receiving releases while the packages stay on the
 * registries forever, and an API version prefix keeps answering long after its
 * library line has stopped moving.
 *
 * A library line runs through two phases. It is maintained while it is the
 * current major, and receives security fixes afterwards. The dates of the
 * closed phases are the real npm release dates of `@dicebear/core`, so the
 * chart cannot claim a fix that was never published.
 *
 * The data is read twice, by the timeline on `/versions/` and by the Markdown
 * mirror built in llms.ts, so the two cannot state different dates.
 */

/** Month names for formatDate, declared up here because the track data below calls it while the module is still evaluating. */
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** First stable release of each major line. */
const RELEASED = {
  5: '2023-01-08',
  6: '2023-03-26',
  7: '2023-08-28',
  8: '2024-03-16',
  9: '2024-06-15',
  10: '2026-05-27',
  // TODO: replace with the actual 11.0.0 release date once it ships.
  11: '2026-09-01',
} as const;

/**
 * Last release of the lines that are done. All four received the same PRNG
 * fix in March 2026, which is where their security phase ends.
 */
const LAST_RELEASE = {
  5: '2026-03-20',
  6: '2026-03-19',
  7: '2026-03-19',
  8: '2026-03-19',
} as const;

/** Announced shutdown of the API versions 5.x to 8.x. */
const API_SHUTDOWN = '2028-04-30';

/** 10.x receives security fixes for a year after 11.0. */
function oneYearLater(iso: string): string {
  const [year, rest] = [iso.slice(0, 4), iso.slice(4)];

  return `${Number(year) + 1}${rest}`;
}

/** What a line receives during one stretch of its life. */
export type PhaseState = 'maintained' | 'security' | 'served' | 'deprecated';

/** Where a line stands today. */
export type LineState = PhaseState | 'eol';

export const stateLabels: Record<LineState, string> = {
  maintained: 'Maintained',
  security: 'Security fixes',
  served: 'Active',
  deprecated: 'Deprecated',
  eol: 'End of life',
};

export interface Phase {
  readonly state: PhaseState;
  readonly from: string;
  /** Undefined where the phase is still running and has no announced end. */
  readonly until?: string;
}

export interface VersionLine {
  /** Prefix of the major line, as used in package ranges and API URLs. */
  readonly version: string;
  /** First stable release of that major. */
  readonly released: string;
  /** The line's state today, which is what the label next to it names. */
  readonly state: LineState;
  readonly phases: readonly Phase[];
  /** Sentence for the last table column. */
  readonly note: string;
}

export interface SupportTrack {
  readonly key: string;
  readonly title: string;
  /** One line under the heading, naming what the track actually covers. */
  readonly subtitle: string;
  /** The phases that appear in this track, in the order they are explained. */
  readonly legend: readonly { state: PhaseState; label: string }[];
  readonly lines: readonly VersionLine[];
}

/** A library line that is done: maintained while current, then security only. */
function retiredLibrary(major: 5 | 6 | 7 | 8, successor: string): VersionLine {
  return {
    version: `${major}.x`,
    released: RELEASED[major],
    state: 'eol',
    phases: [
      { state: 'maintained', from: RELEASED[major], until: successor },
      { state: 'security', from: successor, until: LAST_RELEASE[major] },
    ],
    note: `Last security fix in March 2026.`,
  };
}

export const supportTracks: readonly SupportTrack[] = [
  {
    key: 'libraries',
    title: 'Libraries',
    subtitle: 'The packages you install, in every language',
    legend: [
      { state: 'maintained', label: 'Maintained' },
      { state: 'security', label: 'Security fixes only' },
    ],
    lines: [
      {
        version: '11.x',
        released: RELEASED[11],
        state: 'maintained',
        phases: [{ state: 'maintained', from: RELEASED[11] }],
        note: 'Current line. New styles, options and fixes land here.',
      },
      {
        version: '10.x',
        released: RELEASED[10],
        state: 'security',
        phases: [
          { state: 'maintained', from: RELEASED[10], until: RELEASED[11] },
          {
            state: 'security',
            from: RELEASED[11],
            until: oneYearLater(RELEASED[11]),
          },
        ],
        note: `Security fixes until ${formatDate(oneYearLater(RELEASED[11]))}, a year after 11.0.`,
      },
      {
        version: '9.x',
        released: RELEASED[9],
        state: 'security',
        phases: [
          { state: 'maintained', from: RELEASED[9], until: RELEASED[10] },
          { state: 'security', from: RELEASED[10] },
        ],
        note: 'Long term support. Security fixes, no end date announced.',
      },
      retiredLibrary(8, RELEASED[9]),
      retiredLibrary(7, RELEASED[8]),
      retiredLibrary(6, RELEASED[7]),
      retiredLibrary(5, RELEASED[6]),
    ],
  },
  {
    key: 'http-api',
    title: 'HTTP API',
    subtitle: 'The version prefix in an api.dicebear.com URL',
    legend: [
      { state: 'served', label: 'Answers requests' },
      { state: 'deprecated', label: 'Shutdown announced' },
    ],
    lines: [
      {
        version: '11.x',
        released: RELEASED[11],
        state: 'served',
        phases: [{ state: 'served', from: RELEASED[11] }],
        note: 'Served, no end date announced.',
      },
      {
        version: '10.x',
        released: RELEASED[10],
        state: 'served',
        phases: [{ state: 'served', from: RELEASED[10] }],
        note: 'Served, no end date announced.',
      },
      {
        version: '9.x',
        released: RELEASED[9],
        state: 'served',
        phases: [{ state: 'served', from: RELEASED[9] }],
        note: 'Served, no end date announced.',
      },
      ...([8, 7, 6, 5] as const).map((major) => ({
        version: `${major}.x`,
        released: RELEASED[major],
        state: 'deprecated' as const,
        phases: [
          {
            state: 'deprecated' as const,
            from: RELEASED[major],
            until: API_SHUTDOWN,
          },
        ],
        note: `Shuts down on ${formatDate(API_SHUTDOWN)}.`,
      })),
    ],
  },
];

/** First and last year of the timeline axis, both inclusive. */
export const timelineYears: readonly number[] = [
  2023, 2024, 2025, 2026, 2027, 2028,
];

/**
 * Formats an ISO date as `June 15, 2024`. Written out rather than handed to
 * `Intl`, whose output depends on the ICU data of whoever renders the page,
 * and the server and the browser both render this one.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);

  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/**
 * Where a date sits on the axis, as a fraction between 0 and 1.
 *
 * Every year gets the same width, so the gridlines land on exact fractions and
 * a leap day cannot push a label off its line.
 */
export function axisFraction(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  const start = timelineYears[0];
  const yearStart = Date.UTC(year, 0, 1);
  const yearLength = Date.UTC(year + 1, 0, 1) - yearStart;
  const withinYear = (Date.UTC(year, month - 1, day) - yearStart) / yearLength;

  return (year - start + withinYear) / timelineYears.length;
}

/** Same for a timestamp, used for the marker on today's date. */
export function axisFractionOf(time: number): number {
  const date = new Date(time);

  return axisFraction(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  );
}
