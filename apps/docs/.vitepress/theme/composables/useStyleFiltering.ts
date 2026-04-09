import { ref, computed, Ref } from 'vue';
import { kebabCase, capitalCase } from 'change-case';
import type { CustomStyleEntry } from '@theme/types';
import {
  categoryOrder,
  previewSeeds,
  getStyleCategory,
  normalizeLicense,
} from '@theme/config/styleCategories';

interface StyleMeta {
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
  const selectedLicense = ref<string | null>(null);
  const selectedCategory = ref<string | null>(null);

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
          isCustom: false,
          avatars: previewSeeds.map((seed) => ({
            seed,
          })),
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    if (!customStyles) return builtIn;

    const custom = Object.entries(customStyles.value).map(([key, entry]) => ({
      name: key,
      displayName: entry.name,
      slug: key,
      creator: 'Custom',
      license: 'Unknown',
      licenseNormalized: 'Unknown',
      category: 'Custom',
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
        selectedLicense.value &&
        style.licenseNormalized !== selectedLicense.value
      ) {
        return false;
      }

      if (selectedCategory.value && style.category !== selectedCategory.value) {
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
  const hasActiveFilters = computed(
    () => selectedLicense.value !== null || selectedCategory.value !== null,
  );

  function clearFilters() {
    selectedLicense.value = null;
    selectedCategory.value = null;
  }

  return {
    searchQuery,
    selectedLicense,
    selectedCategory,
    allStyles,
    availableLicenses,
    availableCategories,
    styleList,
    groupedStyles,
    totalStyles,
    hasActiveFilters,
    clearFilters,
  };
}
