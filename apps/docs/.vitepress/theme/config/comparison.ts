export type ComparisonCellValue = 'yes' | 'no' | 'free' | 'paid' | string;

export type ComparisonServiceKey =
  | 'dicebear'
  | 'boringAvatars'
  | 'avvvatars'
  | 'multiavatar'
  | 'jdenticon';

export interface ComparisonService {
  key: ComparisonServiceKey;
  name: string;
  url: string;
  starsRepo: string;
  starsFallback: string;
}

export interface ComparisonRow {
  feature: string;
  values: Record<ComparisonServiceKey, ComparisonCellValue>;
}

export interface ComparisonContext {
  stars: Record<string, string>;
  styleCount: number;
}

export const comparisonServices: readonly ComparisonService[] = [
  {
    key: 'dicebear',
    name: 'DiceBear',
    url: 'https://www.dicebear.com',
    starsRepo: 'dicebear/dicebear',
    starsFallback: '9.2k',
  },
  {
    key: 'boringAvatars',
    name: 'Boring Avatars',
    url: 'https://boringavatars.com',
    starsRepo: 'boringdesigners/boring-avatars',
    starsFallback: '6.3k',
  },
  {
    key: 'avvvatars',
    name: 'Avvvatars',
    url: 'https://avvvatars.com',
    starsRepo: 'nusu/avvvatars',
    starsFallback: '2k',
  },
  {
    key: 'multiavatar',
    name: 'Multiavatar',
    url: 'https://multiavatar.com',
    starsRepo: 'multiavatar/Multiavatar',
    starsFallback: '1.9k',
  },
  {
    key: 'jdenticon',
    name: 'Jdenticon',
    url: 'https://jdenticon.com',
    starsRepo: 'dmester/jdenticon',
    starsFallback: '1.7k',
  },
];

export function buildComparisonRows({
  stars,
  styleCount,
}: ComparisonContext): ComparisonRow[] {
  const githubStars: Record<ComparisonServiceKey, ComparisonCellValue> = {
    dicebear: stars['dicebear/dicebear'] || '9.2k',
    boringAvatars: stars['boringdesigners/boring-avatars'] || '6.3k',
    avvvatars: stars['nusu/avvvatars'] || '2k',
    multiavatar: stars['multiavatar/Multiavatar'] || '1.9k',
    jdenticon: stars['dmester/jdenticon'] || '1.7k',
  };

  return [
    { feature: 'GitHub Stars', values: githubStars },
    {
      feature: 'Avatar Styles',
      values: {
        dicebear: `${styleCount}`,
        boringAvatars: '6',
        avvvatars: '2',
        multiavatar: '1',
        jdenticon: '1',
      },
    },
    {
      feature: 'Customizable Options',
      values: {
        dicebear: 'Extensive',
        boringAvatars: 'Extensive',
        avvvatars: 'Limited',
        multiavatar: 'Limited',
        jdenticon: 'Limited',
      },
    },
    {
      feature: 'Weighted Variants',
      values: {
        dicebear: 'yes',
        boringAvatars: 'no',
        avvvatars: 'no',
        multiavatar: 'no',
        jdenticon: 'no',
      },
    },
    {
      feature: 'HTTP API',
      values: {
        dicebear: 'free',
        boringAvatars: 'paid',
        avvvatars: 'no',
        multiavatar: 'no',
        jdenticon: 'no',
      },
    },
    {
      feature: 'CLI',
      values: {
        dicebear: 'yes',
        boringAvatars: 'no',
        avvvatars: 'no',
        multiavatar: 'no',
        jdenticon: 'yes',
      },
    },
    {
      feature: 'Languages',
      values: {
        dicebear: 'JS/TS, PHP, Python, Rust, Go, Dart',
        boringAvatars: 'JS',
        avvvatars: 'JS/TS',
        multiavatar: 'JS, PHP, Python',
        jdenticon: 'JS, C#, PHP',
      },
    },
    {
      feature: 'Dependencies',
      values: {
        dicebear: '\u2013',
        boringAvatars: 'React',
        avvvatars: 'React',
        multiavatar: '\u2013',
        jdenticon: '\u2013',
      },
    },
    {
      feature: 'Output Formats',
      values: {
        dicebear: 'SVG, PNG, JPEG, WebP, AVIF',
        boringAvatars: 'SVG',
        avvvatars: 'SVG',
        multiavatar: 'SVG',
        jdenticon: 'SVG, PNG',
      },
    },
    {
      feature: 'Design License',
      values: {
        dicebear: 'Varies',
        boringAvatars: 'MIT',
        avvvatars: 'MIT',
        multiavatar: 'Custom',
        jdenticon: 'MIT',
      },
    },
    {
      feature: 'Open Source',
      values: {
        dicebear: 'yes',
        boringAvatars: 'yes',
        avvvatars: 'yes',
        multiavatar: 'yes',
        jdenticon: 'yes',
      },
    },
    {
      feature: 'Deterministic',
      values: {
        dicebear: 'yes',
        boringAvatars: 'yes',
        avvvatars: 'yes',
        multiavatar: 'yes',
        jdenticon: 'yes',
      },
    },
  ];
}
