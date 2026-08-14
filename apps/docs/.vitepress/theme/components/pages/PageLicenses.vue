<script setup lang="ts">
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
import { UiAvatar, UiCard, UiCopyButton } from '../ui';

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
  /** The license text from the definition; only the MIT rows surface it,
   *  since that license requires shipping its notice. */
  credit?: string;
  seed: string;
}

/**
 * Source line of a quoted Creative Commons deed summary; the quote bodies
 * are static markup in the template. CC wrote the deed summaries to stand
 * alone, which is what makes them quotable; the MIT license has no such
 * summary, so the MIT sections describe the condition in one sentence and
 * let the full notice in the card speak for itself. CC dedicates its deed
 * texts to the public domain under CC0 (creativecommons.org/policies#license;
 * the site-wide CC BY footer applies "unless otherwise marked"), so quoting
 * them needs no attribution; the cite line names the source anyway and
 * links that dedication.
 */
interface DeedQuote {
  sourceLabel: string;
  sourceHref: string;
}

interface LicenseGroup {
  id: string;
  title: string;
  intro: string;
  quote?: DeedQuote;
}

/**
 * One section per normalized license, in display order from nothing-to-do to
 * read-the-fine-print. Typed as a Record so a new bucket in normalizeLicense
 * fails the build here instead of silently dropping its styles from the one
 * page whose job is legal attribution. The "Remix of"/"Based on" wording in
 * the rows comes from attributionPrefix, the same source the OG cards use,
 * so the surfaces cannot disagree in what they claim legally.
 */
const licenseGroups: Record<LicenseBucket, LicenseGroup> = {
  'CC0 1.0': {
    id: 'cc0-1-0',
    title: 'CC0 1.0',
    intro:
      'These styles use the CC0 1.0 Public Domain Dedication, which is a ' +
      'waiver rather than a license. Creative Commons sums it up like this:',
    quote: {
      sourceLabel: 'CC0 1.0 deed',
      sourceHref: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
  },
  'CC BY 4.0': {
    id: 'cc-by-4-0',
    title: 'CC BY 4.0',
    intro:
      'These styles are remixes of works licensed under CC BY 4.0. Creative ' +
      'Commons sums the license up like this:',
    quote: {
      sourceLabel: 'CC BY 4.0 deed',
      sourceHref: 'https://creativecommons.org/licenses/by/4.0/',
    },
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
      'terms at the source.',
  },
};

// Theme config is fixed for the life of the page, so everything below is
// derived once instead of through computed refs.
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
  .map(([key, group]) => ({ key, ...group, styles: rowsByLicense[key] ?? [] }))
  .filter((group) => group.styles.length > 0);

const softwareLicense = theme.value.softwareLicense;

const softwareLicenseUrl = `https://github.com/dicebear/dicebear/blob/${theme.value.majorVersion}.x/LICENSE`;

function copyrightLine(text: string): string | undefined {
  return text.split('\n').find((line) => line.startsWith('Copyright'));
}

// License files hard-wrap at ~72 columns, which double-wraps badly in the
// narrower notice box. Reflow each paragraph and let CSS do the wrapping;
// the copy buttons still hand out the original text.
function reflowParagraphs(text: string): string {
  return text
    .split('\n\n')
    .map((paragraph) => paragraph.replaceAll('\n', ' '))
    .join('\n\n');
}
</script>

<template>
  <section
    v-for="group in groups"
    :id="group.id"
    :key="group.id"
    class="page-licenses-section"
  >
    <header class="page-licenses-section-header">
      <h2 class="page-licenses-section-title">
        {{ group.title }}
        <span class="page-licenses-section-count">
          {{ group.styles.length }}
          {{ group.styles.length === 1 ? 'style' : 'styles' }}
        </span>
      </h2>
    </header>
    <p class="page-licenses-section-intro">{{ group.intro }}</p>

    <blockquote v-if="group.quote" class="page-licenses-quote">
      <a
        class="ui-eyebrow page-licenses-quote-source"
        :href="group.quote.sourceHref"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ group.quote.sourceLabel }}
      </a>
      <!-- Verbatim from the Creative Commons deeds, including their
           sub-headings and bold terms; do not edit. -->
      <template v-if="group.id === 'cc0-1-0'">
        <p class="page-licenses-quote-heading">No Copyright</p>
        <p>
          The person who associated a work with this deed has
          <strong>dedicated</strong> the work to the public domain by waiving
          all of his or her rights to the work worldwide under copyright law,
          including all related and neighboring rights, to the extent allowed
          by law.
        </p>
        <p>
          You can copy, modify, distribute and perform the work, even for
          commercial purposes, all without asking permission. See
          <strong>Other Information</strong> below.
        </p>
        <p class="page-licenses-quote-heading">Other Information</p>
        <p>
          In no way are the patent or trademark rights of any person affected
          by CC0, nor are the rights that other persons may have in the work
          or in how the work is used, such as publicity or privacy rights.
        </p>
        <p>
          Unless expressly stated otherwise, the person who associated a work
          with this deed makes no warranties about the work, and disclaims
          liability for all uses of the work, to the fullest extent permitted
          by applicable law.
        </p>
        <p>
          When using or citing the work, you should not imply endorsement by
          the author or the affirmer.
        </p>
      </template>
      <template v-else-if="group.id === 'cc-by-4-0'">
        <p class="page-licenses-quote-heading">You are free to:</p>
        <p>
          <strong>Share</strong> — copy and redistribute the material in any
          medium or format for any purpose, even commercially.
        </p>
        <p>
          <strong>Adapt</strong> — remix, transform, and build upon the
          material for any purpose, even commercially.
        </p>
        <p>
          The licensor cannot revoke these freedoms as long as you follow the
          license terms.
        </p>
        <p class="page-licenses-quote-heading">Under the following terms:</p>
        <p>
          <strong>Attribution</strong> — You must give appropriate credit,
          provide a link to the license, and indicate if changes were made.
          You may do so in any reasonable manner, but not in any way that
          suggests the licensor endorses you or your use.
        </p>
        <p>
          <strong>No additional restrictions</strong> — You may not apply
          legal terms or technological measures that legally restrict others
          from doing anything the license permits.
        </p>
        <p class="page-licenses-quote-heading">Notices:</p>
        <p>
          You do not have to comply with the license for elements of the
          material in the public domain or where your use is permitted by an
          applicable exception or limitation.
        </p>
        <p>
          No warranties are given. The license may not give you all of the
          permissions necessary for your intended use. For example, other
          rights such as publicity, privacy, or moral rights may limit how
          you use the material.
        </p>
      </template>
      <cite class="page-licenses-quote-cite">
        By
        <a
          href="https://creativecommons.org/"
          target="_blank"
          rel="noopener noreferrer"
          >Creative Commons</a
        >, text
        <a
          href="https://creativecommons.org/policies/#license"
          target="_blank"
          rel="noopener noreferrer"
          >dedicated to the public domain (CC0)</a
        >.
      </cite>
    </blockquote>

    <UiCard flush>
      <ul class="page-licenses-rows">
        <li v-for="row in group.styles" :key="row.slug" class="page-licenses-row">
          <div class="page-licenses-avatar" aria-hidden="true">
            <UiAvatar
              :style-name="row.slug"
              :style-options="{ seed: row.seed, size: 88 }"
              :size="44"
              alt=""
            />
          </div>

          <div class="page-licenses-style">
            <a class="page-licenses-name" :href="`/styles/${row.slug}/`">
              {{ row.displayName }}
            </a>
            <span class="page-licenses-credit">
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
                <template v-else>{{ row.title ?? 'the original work' }}</template>
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
              <template v-if="group.key === 'Other'">
                &middot;
                <a
                  v-if="row.licenseUrl"
                  :href="row.licenseUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ row.licenseName }}</a
                >
                <template v-else>{{ row.licenseName }}</template>
              </template>
            </span>
            <template v-if="group.key === 'MIT' && row.credit">
              <span class="page-licenses-copyright">
                {{ copyrightLine(row.credit) }}
              </span>
              <details class="page-licenses-notice">
                <summary>License text</summary>
                <pre>{{ reflowParagraphs(row.credit) }}</pre>
              </details>
            </template>
          </div>

          <UiCopyButton
            v-if="group.key === 'MIT' && row.credit"
            class="ui-copy-button page-licenses-copy"
            :text="row.credit"
            title="Copy license text"
          />
        </li>
      </ul>
    </UiCard>
  </section>

  <section id="software" class="page-licenses-section">
    <header class="page-licenses-section-header">
      <h2 class="page-licenses-section-title">Software</h2>
      <a :href="softwareLicenseUrl" target="_blank" rel="noopener noreferrer">
        LICENSE on GitHub
      </a>
    </header>
    <p class="page-licenses-section-intro">
      The source code in the dicebear/dicebear repository is available under
      the MIT license. That covers the libraries, the HTTP API, and this
      website. The copyright notice and the full license text are below.
    </p>

    <UiCard flush>
      <div class="page-licenses-row page-licenses-row--plain">
        <div class="page-licenses-style">
          <span class="page-licenses-name">MIT License</span>
          <span class="page-licenses-copyright">
            {{ copyrightLine(softwareLicense) }}
          </span>
          <details class="page-licenses-notice">
            <summary>License text</summary>
            <pre>{{ reflowParagraphs(softwareLicense) }}</pre>
          </details>
        </div>
        <UiCopyButton
          class="ui-copy-button page-licenses-copy"
          :text="softwareLicense"
          title="Copy license text"
        />
      </div>
    </UiCard>
  </section>

  <p class="page-licenses-disclaimer">
    The summaries on this page are meant as orientation, not as legal advice.
    The linked license texts are the authoritative source.
  </p>
</template>

<style scoped lang="scss">
.page-licenses-section {
  margin-top: 48px;
  scroll-margin-top: calc(var(--vp-nav-height) + 24px);

  &:first-child {
    margin-top: 32px;
  }
}

.page-licenses-section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--vp-c-border);

  > a {
    flex: none;
    font-size: 13px;
    font-weight: 500;
  }
}

.page-licenses-section-title {
  margin: 0;
  padding: 0;
  border-top: 0 !important;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--vp-c-text-1);
}

.page-licenses-section-count {
  margin-left: 6px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--vp-c-text-3);
}

.page-licenses-section-intro {
  margin: 14px 0 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

/* The quoted deed shares the cards' surface tokens so the page keeps a
   single surface treatment; the eyebrow source label and the cite line are
   what mark it as quoted material. */
.page-licenses-quote {
  margin: 0 0 16px;
  padding: 14px var(--ui-card-padding) 15px;
  background: var(--ui-card-bg);
  border: 1px solid var(--ui-card-border-color);
  border-radius: var(--ui-card-radius);

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: var(--vp-c-text-2);
  }

  p + p {
    margin-top: 6px;
  }

  strong {
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  p.page-licenses-quote-heading {
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  p + .page-licenses-quote-heading {
    margin-top: 12px;
  }
}

.page-licenses-quote-source {
  display: block;
  width: fit-content;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color var(--duration-fast);

  &:hover {
    color: var(--vp-c-brand-2);
  }
}

.page-licenses-quote-cite {
  display: block;
  margin-top: 10px;
  font-size: 12.5px;
  font-style: normal;
  color: var(--vp-c-text-3);

  a {
    color: var(--vp-c-text-2);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: color var(--duration-fast);

    &:hover {
      color: var(--vp-c-brand-1);
    }
  }
}

.page-licenses-rows {
  margin: 0 !important;
  padding: 0;
  list-style: none;
}

.page-licenses-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
  margin: 0;
  padding: 10px var(--ui-card-padding);

  & + & {
    border-top: 1px solid var(--ui-card-border-color);
  }

  &--plain {
    grid-template-columns: minmax(0, 1fr) auto;
  }
}

.page-licenses-avatar {
  line-height: 0;
}

.page-licenses-style {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding-top: 1px;
}

.page-licenses-name {
  width: fit-content;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color var(--duration-fast);
}

a.page-licenses-name:hover {
  color: var(--vp-c-brand-1);
}

.page-licenses-credit {
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  overflow-wrap: anywhere;

  a {
    font-weight: 500;
    color: var(--vp-c-brand-1);
    text-decoration-style: dotted;
    transition: color var(--duration-fast);

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }
}

.page-licenses-copyright {
  margin-top: 2px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.page-licenses-notice {
  margin-top: 6px;
  font-size: 13px;

  summary {
    width: fit-content;
    color: var(--vp-c-text-2);
    cursor: pointer;
    user-select: none;
    transition: color var(--duration-fast);

    &:hover {
      color: var(--vp-c-text-1);
    }
  }

  pre {
    margin: 8px 0 4px;
    padding: 12px 14px;
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    line-height: 1.7;
    white-space: pre-wrap;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg);
    border: 1px solid var(--ui-card-border-color);
    border-radius: var(--vp-radius-chrome);
  }
}

/* The button chrome comes from the global .ui-copy-button class; this only
   optically centers it on the avatar (44px) next to it. */
.page-licenses-copy {
  margin-top: 8px;
}

.page-licenses-row--plain .page-licenses-copy {
  margin-top: 0;
}

.page-licenses-disclaimer {
  margin: 32px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}

/* Matches the styles index, whose category titles drop to 20px here. */
@media (max-width: 640px) {
  .page-licenses-section-title {
    font-size: 20px;
  }
}
</style>
