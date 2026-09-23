<script setup lang="ts">
/**
 * The licenses page: how many styles each license covers, then every style
 * grouped by its license with the artist and the source work linked, then
 * the software license. The deeds are linked, not quoted. The credits use the
 * same wording as the OG cards.
 */
import { useData } from 'vitepress';
import { capitalCase, kebabCase } from 'change-case';
import { ArrowUpRight } from '@lucide/vue';
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

    <div class="site-container">
      <div class="site-licenses-summary">
        <div v-for="group in groups" :key="group.id">
          <div class="site-h2">{{ group.styles.length }}</div>
          <div class="site-body site-licenses-summary-label">
            {{ group.title }}
          </div>
        </div>
      </div>
      <nav class="site-licenses-nav" aria-label="On this page">
        <a
          v-for="group in groups"
          :key="group.id"
          :href="`#${group.id}`"
          class="site-btn site-btn-secondary site-licenses-nav-item"
        >
          {{ group.title }}
          <span>{{ group.styles.length }}</span>
        </a>
      </nav>
    </div>

    <section
      v-for="group in groups"
      :id="group.id"
      :key="group.id"
      class="site-container site-licenses-group"
    >
      <div class="site-licenses-group-head">
        <h2 class="site-h2">{{ group.title }}</h2>
        <span class="site-licenses-group-count">{{
          countLabel(group.styles.length)
        }}</span>
      </div>
      <p class="site-body site-licenses-group-intro">{{ group.intro }}</p>
      <a
        v-if="group.deedHref"
        :href="group.deedHref"
        target="_blank"
        rel="noopener noreferrer"
        class="site-control site-licenses-link hv-link"
      >
        Read the {{ group.deedLabel }}
        <ArrowUpRight :size="16" />
      </a>
      <ul class="site-licenses-rows">
        <li
          v-for="row in group.styles"
          :key="row.slug"
          class="site-licenses-row"
        >
          <SiteAvatar
            :style-name="row.slug"
            :options="{ seed: row.seed }"
            :size="44"
            :radius="12"
            :alt="`${row.displayName} avatar`"
          />
          <div class="site-licenses-row-text">
            <a
              class="site-licenses-row-name hv-link"
              :href="`/styles/${row.slug}/`"
            >
              {{ row.displayName }}
            </a>
            <span class="site-licenses-row-credit">
              <template v-if="row.kind === 'own-work'">By DiceBear</template>
              <template v-else>
                {{ attributionPrefix(row.kind) }}
                <a
                  v-if="row.sourceUrl"
                  :href="row.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hv-row"
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
                  class="hv-row"
                  >{{ row.creator }}</a
                >
                <template v-else>{{ row.creator }}</template>
              </template>
            </span>
            <a
              v-if="!group.deedHref && row.licenseUrl"
              :href="row.licenseUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="site-licenses-row-license hv-link"
            >
              {{ row.licenseName }}
              <ArrowUpRight :size="14" />
            </a>
            <template v-if="group.key === 'MIT' && row.credit">
              <span class="site-licenses-row-credit">{{
                copyrightLine(row.credit)
              }}</span>
              <details class="site-licenses-notice">
                <summary>License text</summary>
                <pre>{{ reflowParagraphs(row.credit) }}</pre>
              </details>
            </template>
          </div>
        </li>
      </ul>
    </section>

    <section id="software" class="site-container site-licenses-group">
      <div class="site-licenses-group-head">
        <h2 class="site-h2">Software</h2>
      </div>
      <p class="site-body site-licenses-group-intro">
        The DiceBear code is published under the MIT license. That covers the
        libraries, the CLI and this website, not the avatar styles above.
      </p>
      <a
        :href="softwareLicenseUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="site-control site-licenses-link hv-link"
      >
        Read the MIT license
        <ArrowUpRight :size="16" />
      </a>
      <div class="site-facts site-licenses-software">
        <div class="site-fact">
          <b>Copyright</b>
          <span>{{ copyrightLine(softwareLicense) }}</span>
        </div>
        <div class="site-fact">
          <b>Text</b>
          <span>
            <details class="site-licenses-notice">
              <summary>License text</summary>
              <pre>{{ reflowParagraphs(softwareLicense) }}</pre>
            </details>
          </span>
        </div>
      </div>
    </section>

    <div class="site-container site-licenses-end">
      <p class="site-text">
        The summaries on this page are meant as orientation, not as legal
        advice. The linked license texts are the authoritative source.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-licenses {
  &-summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 64px;
    padding-top: 32px;
    border-top: 1px solid var(--db-line);

    &-label {
      margin-top: 8px;
    }

    @media (max-width: 767px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 32px 24px;
      margin-top: 48px;
    }
  }

  &-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 40px;

    &-item span {
      font-weight: 500;
      color: var(--db-muted);
    }
  }

  &-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 96px;
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
      gap: 4px 20px;
    }

    &-count {
      font-size: 16px;
      line-height: 26px;
      color: var(--db-muted);
    }

    &-intro {
      max-width: 720px;
      margin-top: 16px;
    }

    @media (max-width: 767px) {
      padding-top: 88px;
    }
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    color: var(--db-brand-text);
  }

  &-rows {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 64px;
    align-self: stretch;
    margin: 36px 0 0;
    padding: 0;
    list-style: none;

    @media (max-width: 767px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;

    &-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      min-width: 0;
    }

    &-name {
      font-size: 18px;
      line-height: 24px;
      font-weight: 600;
    }

    /* Credits and license names wrap and are never cut. */
    &-credit {
      font-size: 16px;
      line-height: 26px;
      color: var(--db-muted);
      overflow-wrap: anywhere;
    }

    &-license {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      line-height: 24px;
      font-weight: 500;
      color: var(--db-brand-text);
    }
  }

  &-notice {
    font-size: 14px;
    line-height: 20px;

    summary {
      cursor: pointer;
      color: var(--db-ink);
    }

    pre {
      margin: 12px 0 0;
      white-space: pre-wrap;
      font-family: inherit;
      font-size: 14px;
      line-height: 20px;
      color: var(--db-ink-2);
    }
  }

  &-software {
    align-self: stretch;
    margin-top: 36px;
  }

  &-end {
    padding-top: 96px;
    padding-bottom: 120px;

    p {
      max-width: 720px;
      color: var(--db-muted);
    }

    @media (max-width: 767px) {
      padding-bottom: 64px;
    }
  }
}

/* Kept at low specificity so the shared hover color applies. */
:where(.site-licenses-row-credit) a {
  border-bottom: 1px dashed var(--db-hover-border);
  color: var(--db-ink-2);
}
</style>
