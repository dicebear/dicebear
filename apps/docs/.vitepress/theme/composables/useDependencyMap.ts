import { computed, type Ref } from 'vue';
import type { Style } from '@dicebear/core';
import { isColorAttr, type DefinitionElement } from '@theme/utils/definitionElement';

export type ComponentDependency = {
  parentName: string;
  parentVariant: string;
  parentColors: { colorKey: string; defaultCount: number }[];
};

type VariantRefs = {
  childComponents: string[];
  colorRefs: Set<string>;
};

export function useDependencyMap(loadedStyle: Ref<Style | null>) {
  const componentDeps = computed<Record<string, ComponentDependency>>(() => {
    if (!loadedStyle.value) {
      return {};
    }

    const deps: Record<string, ComponentDependency> = {};

    for (const [compName, component] of loadedStyle.value.components()) {
      for (const [variantName, variant] of component.variants()) {
        const refs: VariantRefs = { childComponents: [], colorRefs: new Set() };

        collectVariantRefs(variant.elements(), refs);

        if (refs.childComponents.length === 0) {
          continue;
        }

        const parentColors = [...refs.colorRefs].map((c) => ({
          colorKey: `${c}Color`,
          defaultCount: loadedStyle.value!.colors().get(c)?.values().length ?? 0,
        }));

        for (const child of refs.childComponents) {
          deps[child] = {
            parentName: compName,
            parentVariant: variantName,
            parentColors,
          };
        }
      }
    }

    return deps;
  });

  return { componentDeps };
}

function collectVariantRefs(
  elements: readonly DefinitionElement[],
  refs: VariantRefs,
) {
  for (const el of elements) {
    if (el.type() === 'component' && typeof el.value() === 'string') {
      refs.childComponents.push(el.value() as string);
    }

    const attrs = el.attributes();

    if (attrs) {
      for (const val of Object.values(attrs)) {
        if (isColorAttr(val)) {
          refs.colorRefs.add(val.value);
        }
      }
    }

    collectVariantRefs(el.children(), refs);
  }
}
