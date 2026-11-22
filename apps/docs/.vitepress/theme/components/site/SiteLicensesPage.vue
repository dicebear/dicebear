<script setup lang="ts">
/**
 * The licenses page: how many styles each license covers, as tiles on a
 * yellow block that jump to their section, then every style grouped by its
 * license with the artist and the source work linked, then the software
 * license on a soft block. The deeds are linked, not quoted. The credits use the
 * same wording as the OG cards.
 */
import { useData } from 'vitepress';
import { capitalCase, kebabCase } from 'change-case';
import type { ThemeOptions } from '@theme/types';
import {
  normalizeLicense,
  type LicenseBucket,
} from '@theme/config/styleCategories';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import {
  attributionKind,
  attributionPrefix,
  type AttributionKind,
} from '@theme/utils/license';
import { formatLicenseName } from '@theme/utils/format';
import { safeHttpUrl } from '@theme/utils/url';
import SiteAvatar from './SiteAvatar.vue';
import SitePageHead from './SitePageHead.vue';
import SiteSection from './SiteSection.vue';
import SiteStat from './SiteStat.vue';

const { theme } = useData<ThemeOptions>();

interface StyleRow {
  slug: string;
  displayName: string;
  kind: AttributionKind;
  title?: string;
  sourceUrl?: string;
  creator?: string;
  creatorUrl?: string;
  licenseName: string;
  licenseUrl?: string;
  /** The license text from the definition. Only the MIT rows show it. */
  credit?: string;
  seed: string;
}

interface LicenseGroup {
  id: string;
  title: string;
  intro: string;
  /** The deed page, linked from the group and from every row of it. */
  deedHref?: string;
  deedLabel?: string;
}

/**
 * One section per normalized license, from nothing-to-do to read-the-fine-
 * print. Typed as a Record so a new bucket in normalizeLicense fails the
 * build here instead of dropping its styles from the one page whose job is
 * attribution.
 */
const licenseGroups: Record<LicenseBucket, LicenseGroup> = {
  'CC0 1.0': {
    id: 'cc0-1-0',
    title: 'CC0 1.0',
    intro:
      'These styles use the CC0 1.0 Public Domain Dedication, which is a ' +
      'waiver rather than a license. Creative Commons describes what that ' +
      'means on the deed page.',
    deedHref: 'https://creativecommons.org/publicdomain/zero/1.0/',
    deedLabel: 'CC0 1.0 deed',
  },
  'CC BY 4.0': {
    id: 'cc-by-4-0',
    title: 'CC BY 4.0',
    intro:
      'These styles are remixes of works licensed under CC BY 4.0. The ' +
      'deed page describes what the license asks for and what it allows.',
    deedHref: 'https://creativecommons.org/licenses/by/4.0/',
    deedLabel: 'CC BY 4.0 deed',
  },
  MIT: {
    id: 'mit',
    title: 'MIT',
    intro:
      'The MIT license has a single condition: the copyright and permission ' +
      'notice stays with the work. Expand the style below to read its ' +
      'notice.',
  },
  Other: {
    id: 'artists-own-terms',
    title: "Artist's own terms",
    intro:
      'The artists of these styles wrote their own terms instead of picking ' +
      'a standard license. They describe their work as free for personal ' +
      'and commercial use. Follow the license link on a style to read the ' +
      'original wording.',
  },
};

const rowsByLicense: Partial<Record<LicenseBucket, StyleRow[]>> = {};

for (const [styleName, style] of Object.entries(theme.value.avatarStyles)) {
  const meta = style.meta;
  const slug = kebabCase(styleName);
  const licenseName = formatLicenseName(meta.license?.name);
  const row: StyleRow = {
    slug,
    displayName: capitalCase(styleName),
    kind: attributionKind(meta),
    title: meta.title,
    sourceUrl: safeHttpUrl(meta.source),
    creator: meta.creator,
    creatorUrl: safeHttpUrl(meta.homepage),
    licenseName,
    licenseUrl: safeHttpUrl(meta.license?.url),
    credit: meta.license?.text,
    seed: getStyleCardSeeds(slug)[0],
  };
  (rowsByLicense[normalizeLicense(licenseName)] ??= []).push(row);
}

const groups = (
  Object.entries(licenseGroups) as [LicenseBucket, LicenseGroup][]
)
  .map(([key, group]) => ({
    key,
    ...group,
    styles: (rowsByLicense[key] ?? []).sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    ),
  }))
  .filter((group) => group.styles.length > 0);

function countLabel(count: number): string {
  return `${count} ${count === 1 ? 'style' : 'styles'}`;
}

const softwareLicense = theme.value.softwareLicense;
const softwareLicenseUrl = `https://github.com/dicebear/dicebear/blob/${theme.value.majorVersion}.x/LICENSE`;

function copyrightLine(text: string): string | undefined {
  return text.split('\n').find((line) => line.startsWith('Copyright'));
}

/** License files hard-wrap at about 72 columns. Reflowed, CSS wraps them. */
function reflowParagraphs(text: string): string {
  return text
    .split('\n\n')
    .map((paragraph) => paragraph.replaceAll('\n', ' '))
    .join('\n\n');
}
</script>

<template>
  <div class="site-licenses">
    <SitePageHead
      :crumbs="[{ text: 'Home', link: '/' }, { text: 'Licenses' }]"
      title="Licenses"
    >
      <slot />
    </SitePageHead>

    <section class="site-box is-block is-sun site-licenses-summary">
      <nav class="site-grid site-licenses-counts" aria-label="On this page">
        <a
          v-for="group in groups"
          :key="group.id"
          :href="`#${group.id}`"
          class="site-box is-card site-licenses-count"
        >
          <SiteStat :value="String(group.styles.length)" :label="group.title" />
        </a>
      </nav>
    </section>

    <section
      v-for="group in groups"
      :id="group.id"
      :key="group.id"
      class="site-container site-licenses-group"
    >
      <div class="site-licenses-group-head">
        <h2 class="site-h2">{{ group.title }}</h2>
        <p class="site-control site-licenses-group-count">
          {{ countLabel(group.styles.length) }}
        </p>
      </div>
      <p class="site-body site-licenses-group-intro">{{ group.intro }}</p>
      <a
        v-if="group.deedHref"
        :href="group.deedHref"
        target="_blank"
        rel="noopener noreferrer"
        class="site-link-arrow"
      >
        Read the {{ group.deedLabel }}
      </a>
      <ul class="site-licenses-rows">
        <li
          v-for="row in group.styles"
          :key="row.slug"
          class="site-row site-licenses-row"
        >
          <SiteAvatar
            :style-name="row.slug"
            :options="{ seed: row.seed }"
            :size="48"
            :alt="`${row.displayName} avatar`"
          />
          <div class="site-licenses-row-text">
            <a
              class="site-title site-licenses-row-name"
              :href="`/styles/${row.slug}/`"
            >
              {{ row.displayName }}
            </a>
            <p class="site-text site-licenses-row-credit">
              <template v-if="row.kind === 'own-work'">By DiceBear</template>
              <template v-else>
                {{ attributionPrefix(row.kind) }}
                <a
                  v-if="row.sourceUrl"
                  :href="row.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ row.title ?? 'the original work' }}</a
                >
                <template v-else>{{
                  row.title ?? 'the original work'
                }}</template>
                by
                <a
                  v-if="row.creatorUrl"
                  :href="row.creatorUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ row.creator }}</a
                >
                <template v-else>{{ row.creator }}</template>
              </template>
              <template v-if="!group.deedHref && row.licenseUrl">
                ·
                <a
                  :href="row.licenseUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ row.licenseName }}</a
                >
              </template>
            </p>
          </div>
        </li>
      </ul>
      <template v-for="row in group.styles" :key="row.slug">
        <template v-if="group.key === 'MIT' && row.credit">
          <p class="site-mono site-licenses-copyright">
            {{ copyrightLine(row.credit) }}
          </p>
          <details class="site-details site-licenses-notice">
            <summary>License text</summary>
            <pre>{{ reflowParagraphs(row.credit) }}</pre>
          </details>
        </template>
      </template>
    </section>

    <SiteSection
      id="software"
      tone="soft"
      title="Software"
      class="site-licenses-software"
    >
      <div class="site-licenses-software-body">
        <p class="site-body">
          The DiceBear code is published under the MIT license. That covers the
          libraries, the CLI and this website, not the avatar styles above.
        </p>
        <a
          :href="softwareLicenseUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="site-link-arrow"
        >
          Read the MIT license
        </a>
        <dl class="site-facts site-licenses-facts">
          <div class="site-fact">
            <dt>Copyright</dt>
            <dd class="site-mono">{{ copyrightLine(softwareLicense) }}</dd>
          </div>
        </dl>
        <details class="site-details site-licenses-notice">
          <summary>License text</summary>
          <pre>{{ reflowParagraphs(softwareLicense) }}</pre>
        </details>
      </div>
    </SiteSection>

    <p class="site-container site-text site-licenses-end">
      The summaries on this page are meant as orientation, not as legal advice.
      The linked license texts are the authoritative source.
    </p>
  </div>
</template>

<style scoped lang="scss">
.site-licenses {
  /* The counts: translucent cards on yellow, each a jump to its section. */
  &-summary {
    margin-top: clamp(40px, 5vw, 72px);
  }

  &-counts {
    --site-grid-min: 140px;

    gap: clamp(8px, 1.4vw, 20px);
  }

  &-count {
    background: var(--db-soft);
    color: var(--db-ink);
    text-decoration: none;
    transition: background-color 0.15s;

    &:hover {
      background: var(--db-panel);
    }
  }

  &-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: clamp(48px, 5.6vw, 80px);
    scroll-margin-top: calc(var(--db-header-h) + 24px);

    /* The router focuses the section a hash points at. The outline that
       comes with that has no use on a block of text. */
    &:focus {
      outline: none;
    }

    &-head {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px 20px;
    }

    &-count {
      margin: 0;
      font-weight: 600;
      color: var(--db-muted);
    }

    &-intro {
      max-width: 720px;
      margin-top: 16px;
    }

    > .site-link-arrow {
      margin-top: 12px;
    }
  }

  /* The styles in columns of hairline rows. */
  &-rows {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(360px, 100%), 1fr));
    gap: 0 clamp(32px, 4vw, 64px);
    align-self: stretch;
    margin: 28px 0 0;
    padding: 0;
    list-style: none;
  }

  &-row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    padding: 10px 0;

    &-text {
      min-width: 0;
    }

    &-name {
      color: var(--db-ink);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 4px;
      }
    }

    /* Credits and license names wrap and are never cut. */
    &-credit {
      overflow-wrap: anywhere;

      a {
        font-weight: 600;
        color: inherit;
        text-decoration: underline;
        text-decoration-color: var(--db-field-border);
        text-underline-offset: 3px;

        &:hover {
          color: var(--db-ink);
          text-decoration-color: currentColor;
        }
      }
    }
  }

  &-copyright {
    margin: 16px 0 0;
    font-size: 14px;
    line-height: 22px;
    color: var(--db-ink-2);
  }

  &-notice {
    align-self: stretch;
    margin-top: 16px;

    pre {
      white-space: pre-wrap;
      font-family: var(--db-font-mono);
      font-size: 13px;
      line-height: 22px;
      color: var(--db-ink-2);
    }
  }

  &-software {
    margin-top: clamp(56px, 6.4vw, 96px);

    &-body {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      > .site-link-arrow {
        margin-top: 12px;
      }
    }
  }

  &-facts {
    align-self: stretch;
    margin-top: 16px;
    border-bottom: 0;

    dd {
      font-size: 14px;
    }
  }

  &-end {
    margin-top: clamp(32px, 4vw, 48px);
    margin-bottom: clamp(8px, 1vw, 16px);
  }
}
</style>
