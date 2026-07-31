import { ref, computed, type Ref } from 'vue';
import { kebabCase, capitalCase } from 'change-case';
import type { CustomStyleEntry } from '@theme/types';
import {
  CUSTOM_CATEGORY,
  categoryOrder,
  previewSeeds,
  getStyleCategory,
  normalizeLicense,
} from '@theme/config/styleCategories';

interface StyleMeta {
  animated?: boolean;
  meta: {
    license?: { name?: string };
    creator?: string;
  };
}

export function useStyleFiltering(
  styles: Record<string, StyleMeta>,
  customStyles?: Ref<Record<string, CustomStyleEntry>>,
) {
  const searchQuery = ref('');
  const selectedLicenses = ref<string[]>([]);
  const selectedCategories = ref<string[]>([]);
  const animatedOnly = ref(false);

  const allStyles = computed(() => {
    const builtIn = Object.entries(styles)
      .map(([styleName, style]) => {
        const rawLicense = style.meta.license?.name || 'Unknown';

        return {
          name: styleName,
          displayName: capitalCase(styleName),
          slug: kebabCase(styleName),
          creator: style.meta.creator || 'Unknown',
          license: rawLicense,
          licenseNormalized: normalizeLicense(rawLicense),
          category: getStyleCategory(kebabCase(styleName)),
          animated: style.animated ?? false,
          isCustom: false,
          avatars: previewSeeds.map((seed) => ({
            seed,
          })),
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    if (!customStyles) {
      return builtIn;
    }

    const custom = Object.entries(customStyles.value).map(([key, entry]) => ({
      name: key,
      displayName: entry.name,
      slug: key,
      creator: CUSTOM_CATEGORY,
      license: 'Unknown',
      licenseNormalized: 'Unknown',
      category: CUSTOM_CATEGORY,
      animated: false,
      isCustom: true,
      avatars: previewSeeds.map((seed) => ({
        seed,
      })),
    }));

    return [...custom, ...builtIn];
  });

  const availableLicenses = computed(() => {
    const licenses = new Set(allStyles.value.map((s) => s.licenseNormalized));

    return Array.from(licenses).sort();
  });

  const availableCategories = computed(() => {
    const categories = new Set(allStyles.value.map((s) => s.category));

    return Array.from(categories).sort(
      (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
    );
  });

  const styleList = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    return allStyles.value.filter((style) => {
      if (
        query &&
        !style.displayName.toLowerCase().includes(query) &&
        !style.creator.toLowerCase().includes(query)
      ) {
        return false;
      }

      if (
        selectedLicenses.value.length > 0 &&
        !selectedLicenses.value.includes(style.licenseNormalized)
      ) {
        return false;
      }

      if (
        selectedCategories.value.length > 0 &&
        !selectedCategories.value.includes(style.category)
      ) {
        return false;
      }

      if (animatedOnly.value && !style.animated) {
        return false;
      }

      return true;
    });
  });

  const groupedStyles = computed(() => {
    const groups: Record<string, typeof styleList.value> = {};
    for (const style of styleList.value) {
      if (!groups[style.category]) {
        groups[style.category] = [];
      }

      groups[style.category].push(style);
    }

    const sortedGroups: typeof groups = {};
    for (const cat of categoryOrder) {
      if (groups[cat]) {
        sortedGroups[cat] = groups[cat];
      }
    }

    return sortedGroups;
  });

  const totalStyles = computed(() => Object.keys(styles).length);

  return {
    searchQuery,
    selectedLicenses,
    selectedCategories,
    animatedOnly,
    allStyles,
    availableLicenses,
    availableCategories,
    styleList,
    groupedStyles,
    totalStyles,
  };
}
