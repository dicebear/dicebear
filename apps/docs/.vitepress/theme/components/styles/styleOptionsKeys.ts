import { readonly, ref, type InjectionKey, type Ref } from 'vue';
import type { ComponentPreview } from '@theme/utils/componentPreview';

export const componentNamesKey: InjectionKey<Ref<string[]>> =
  Symbol('componentNames');
export const componentNamesDefault = readonly(ref<string[]>([]));

export const styleColorsKey: InjectionKey<Ref<Record<string, string[]>>> =
  Symbol('styleColors');
export const styleColorsDefault = readonly(ref<Record<string, string[]>>({}));

export const componentPreviewKey: InjectionKey<Ref<ComponentPreview | null>> =
  Symbol('componentPreview');
export const componentPreviewDefault = readonly(
  ref<ComponentPreview | null>(null),
);

export const styleDefaultsKey: InjectionKey<Ref<Record<string, unknown>>> =
  Symbol('styleDefaults');
export const styleDefaultsDefault = readonly(ref<Record<string, unknown>>({}));

export const navigateToColorKey: InjectionKey<(colorName: string) => void> =
  Symbol('navigateToColor');

export type VariantTagsLookup = (
  component: string,
  variant: string,
) => string[];
export const variantTagsKey: InjectionKey<VariantTagsLookup> =
  Symbol('variantTags');
export const variantTagsDefault: VariantTagsLookup = () => [];

export const showVariantTagsKey: InjectionKey<Ref<boolean>> =
  Symbol('showVariantTags');
export const showVariantTagsDefault = readonly(ref(false));
