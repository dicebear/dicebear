import type { Options, StyleOptions } from './types.js';
import { StyleModel } from './models/StyleModel.js';
import { LicenseHelper } from './helpers/LicenseHelper.js';
import { SvgHelper } from './helpers/SvgHelper.js';
import { AvatarModel } from './models/AvatarModel.js';
import { PropertiesCollection } from './collections/PropertiesCollection.js';
import { AttributesCollection } from './collections/AttributesCollection.js';
import { OptionsCollection } from './collections/OptionsCollection.js';
import { ColorModel } from './models/ColorModel.js';
import { PropertiesHelper } from './helpers/PropertiesHelper.js';
import { AttributesHelper } from './helpers/AttributesHelper.js';
import { DependencyHelper } from './helpers/DependencyHelper.js';

export class AvatarBuilder<S extends StyleOptions = StyleOptions> {
  constructor(private readonly style: StyleModel<S>) {}

  build(options: Options<S>): AvatarModel {
    // Define properties
    const properties = PropertiesHelper.getProperties(
      this.style,
      new OptionsCollection(options),
    );

    // Define attributes
    const attributes = AttributesHelper.getAttributes(
      this.style,
      properties.get('size') as number | undefined,
    );

    // Create avatar model
    const svgAttributes = SvgHelper.createAttrString(attributes.all());
    const svgMetadata = LicenseHelper.getLicenseAsXml(this.style.getMetadata());

    const svgBody = this.buildSvgBody(properties, attributes);
    const svgRoot = `<svg ${svgAttributes}>${svgMetadata}${svgBody}</svg>`;

    return new AvatarModel(svgRoot, this.style.getMetadata(), properties.all());
  }

  private buildSvgBody(
    properties: PropertiesCollection,
    attributes: AttributesCollection,
  ): string {
    const viewBox = attributes.getViewBox();
    const { colors, components } = DependencyHelper.getFromProperties(
      this.style,
      properties,
    );

    const scale = properties.getNumber('scale');
    const flip = properties.getBoolean('flip');
    const rotate = properties.getNumber('rotate');
    const translateX = properties.getNumber('translateX');
    const translateY = properties.getNumber('translateY');
    const backgroundColor = properties.get('backgroundColor');
    const radius = properties.getNumber('radius');
    const clip = properties.getBoolean('clip');
    const randomizeIds = properties.getBoolean('randomizeIds');

    // Create body
    const colorGradients = [...colors].map((colorName) =>
      this.createColorGradient(properties, colorName),
    );

    const componentsSymbols = [...components].map((componentName) =>
      this.createComponentSymbol(properties, componentName),
    );

    let svgBody = [
      '<defs>',
      ...colorGradients,
      '</defs>',
      ...componentsSymbols,
      this.style.getBody().content,
    ].join('');

    // Replace placeholders
    svgBody = SvgHelper.replacePlaceholders(svgBody, properties.all());

    // Add scale
    if (scale !== undefined && scale !== 100) {
      svgBody = SvgHelper.addScale(svgBody, viewBox, scale);
    }

    // Add flip
    if (flip) {
      svgBody = SvgHelper.addFlip(svgBody, viewBox);
    }

    // Add rotate
    if (rotate) {
      svgBody = SvgHelper.addRotate(svgBody, viewBox, rotate);
    }

    // Add translate
    if (translateX || translateY) {
      svgBody = SvgHelper.addTranslate(
        svgBody,
        viewBox,
        translateX,
        translateY,
      );
    }

    // Add background
    if (
      backgroundColor instanceof ColorModel &&
      !backgroundColor.isTransparent()
    ) {
      svgBody = SvgHelper.addBackground(svgBody, viewBox, backgroundColor);
    }

    // Add radius and clip
    if (radius || clip) {
      svgBody = SvgHelper.addRadius(svgBody, viewBox, radius);
    }

    // Randomize ids
    if (randomizeIds) {
      svgBody = SvgHelper.randomizeIds(svgBody);
    }

    return svgBody;
  }

  private createComponentSymbol(
    properties: PropertiesCollection,
    componentName: string,
  ) {
    const componentValueName = properties.get(componentName);
    const componentRotation = properties.get(`${componentName}Rotation`);
    const componentOffsetX = properties.get(`${componentName}OffsetX`);
    const componentOffsetY = properties.get(`${componentName}OffsetY`);

    if (typeof componentValueName !== 'string') {
      return '';
    }

    const componentValue = this.style.getComponentValueByName(
      componentName,
      componentValueName,
    )!;

    let componentContent = componentValue.content;

    if (componentRotation || componentOffsetX || componentOffsetY) {
      const component = this.style.getComponentByName(componentName)!;

      componentContent = `<g transform="translate(${componentOffsetX ?? 0}, ${componentOffsetY ?? 0}) rotate(${componentRotation ?? 0} ${component.width / 2} ${component.height / 2})">${componentContent}</g>`;
    }

    return `<symbol id="component-${SvgHelper.escape(componentName)}">${componentContent}</symbol>`;
  }

  private createColorGradient(
    properties: PropertiesCollection,
    colorName: string,
  ) {
    const colorValue = properties.get(`${colorName}Color`);

    if (!(colorValue instanceof ColorModel)) {
      return '';
    }

    return `<linearGradient id="color-${SvgHelper.escape(colorName)}"><stop stop-color="rgba(${colorValue.getRgba().join(', ')})"/></linearGradient>`;
  }
}
