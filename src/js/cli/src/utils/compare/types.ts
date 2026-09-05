export type ChangeScope =
  'canvas' | 'meta' | 'animations' | 'component' | 'variant' | 'color';

export type ChangeKind = 'added' | 'removed' | 'changed';

/** One difference between the two definitions of a pair. */
export interface DefinitionChange {
  scope: ChangeScope;
  kind: ChangeKind;
  /** `hair`, `hair/long`, `skin`, `canvas`, `license`, ... */
  name: string;
  /** What changed, for `changed` entries. */
  detail?: string;
}

/** One rendered pair whose pixels differ by more than the tolerance. */
export interface PixelDifference {
  /** `seed-3` or `hair/long`. */
  name: string;
  /** Share of differing pixels in percent. */
  share: number;
}

export interface SweepResult {
  total: number;
  different: PixelDifference[];
}

export type PairStatus =
  'identical' | 'changed' | 'only-before' | 'only-after' | 'error';

/** The report for one style name. */
export interface PairReport {
  name: string;
  status: PairStatus;
  changes: DefinitionChange[];
  seeds?: SweepResult;
  variants?: SweepResult;
  /** Explains a skipped pixel sweep or an `error` status. */
  note?: string;
}

export interface CompareOptions {
  seeds: number;
  /** Share of differing pixels, in percent, above which a render is reported. */
  tolerance: number;
  /** pixelmatch's per-pixel sensitivity, 0 to 1. */
  threshold: number;
  size: number;
  systemFonts: boolean;
  /** Directory for the before/after/diff PNGs of reported differences. */
  output?: string;
}

export interface CompareReport {
  options: Omit<CompareOptions, 'output'>;
  styles: PairReport[];
}
