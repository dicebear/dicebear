import { Style, Avatar, type StyleDefinition } from '@dicebear/core';
import { exampleSeeds } from '@theme/config/styleCategories';

export class ComponentPreview {
  #style: Style;
  #definition: StyleDefinition;
  #syntheticStyleCache = new Map<string, Style>();
  #dataUriCache = new Map<string, string>();

  constructor(style: Style) {
    this.#style = style;
    this.#definition = style.definition();
  }

  firstVariant(componentName: string): string | undefined {
    const component = this.#style.components().get(componentName);

    if (!component) return undefined;

    return component.variants().keys().next().value;
  }

  toSvg(
    componentName: string,
    variantName: string,
    options?: Record<string, unknown>,
  ): string {
    const def = this.#definition;
    const component = this.#style.components().get(componentName);

    if (!component) return '';

    // Cache the Style per component to avoid repeated validation + cloning
    let syntheticStyle = this.#syntheticStyleCache.get(componentName);

    if (!syntheticStyle) {
      // Strip scale/translate/rotate so the component renders centered
      // on its own preview canvas instead of being offset for the full
      // avatar canvas it was authored for.
      const sourceName = component.sourceName();
      const sanitizedComponents = { ...def.components };
      const target = sanitizedComponents[sourceName];

      if (target && !('extends' in target)) {
        sanitizedComponents[sourceName] = {
          width: target.width,
          height: target.height,
          probability: target.probability,
          variants: target.variants,
        };
      }

      syntheticStyle = new Style({
        canvas: {
          width: component.width(),
          height: component.height(),
          elements: [{ type: 'component' as const, name: componentName }],
        },
        attributes: def.attributes,
        components: sanitizedComponents,
        colors: def.colors,
      });
      this.#syntheticStyleCache.set(componentName, syntheticStyle);
    }

    // Pass a fixed seed so variables that depend on it (e.g. `initial` /
    // `initials` text content in the initials style) resolve, otherwise
    // text-driven colors render onto an empty <text> and stay invisible.
    const previewOptions: Record<string, unknown> = {
      seed: exampleSeeds[0],
      backgroundColor: [],
      [`${componentName}Probability`]: 100,
    };

    Object.assign(previewOptions, options);
    previewOptions[`${componentName}Variant`] = variantName;

    return new Avatar(syntheticStyle, previewOptions).toString();
  }

  toDataUri(
    componentName: string,
    variantName: string,
    options?: Record<string, unknown>,
  ): string {
    if (!options) {
      const key = `${componentName}|${variantName}`;
      const cached = this.#dataUriCache.get(key);

      if (cached !== undefined) return cached;

      const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.toSvg(componentName, variantName))}`;

      this.#dataUriCache.set(key, uri);

      return uri;
    }

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.toSvg(componentName, variantName, options))}`;
  }
}
