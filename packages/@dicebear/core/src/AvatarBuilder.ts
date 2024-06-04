import type { Dependencies, Options, StyleOptions } from './types.js';
import { StyleModel } from './models/StyleModel.js';
import { LicenseHelper } from './helpers/LicenseHelper.js';
import { SvgHelper } from './helpers/SvgHelper.js';
import { AvatarModel } from './models/AvatarModel.js';
import { PropertiesCollection } from './collections/PropertiesCollection.js';
import { AttributesCollection } from './collections/AttributesCollection.js';
import { OptionsCollection } from './collections/OptionsCollection.js';
import { Prng } from './Prng.js';
import { ColorModel } from './models/ColorModel.js';
import { StringHelper } from './helpers/StringHelper.js';
import { ColorHelper } from './helpers/ColorHelper.js';

export class AvatarBuilder<S extends StyleOptions = StyleOptions> {
  private readonly properties = new PropertiesCollection();
  private readonly attributes = new AttributesCollection();
  private readonly options: OptionsCollection<S>;
  private readonly prng: Prng;

  private avatarModel?: AvatarModel;

  constructor(
    private readonly style: StyleModel<S>,
    options: Options<S>,
  ) {
    this.options = new OptionsCollection(options);
    this.prng = new Prng(this.options.getString('seed'));
  }

  build(): AvatarModel {
    this.avatarModel ??= this.buildAvatarModel();

    return this.avatarModel;
  }

  private buildAvatarModel(): AvatarModel {
    // Define properties
    this.defineCoreProperties();
    this.defineColorProperties();
    this.defineComponentProperties();

    // Define attributes
    this.defineDefaultAttributes();
    this.defineSizeAttributes();

    // Create avatar model
    return new AvatarModel(
      this.buildSvg(),
      this.style.getMetadata(),
      this.properties.all(),
    );
  }

  private buildSvg(): string {
    const viewBox = this.attributes.getViewBox();
    const { colors, components } = this.getDependencies();

    const scale = this.properties.getNumber('scale');
    const flip = this.properties.getBoolean('flip');
    const rotate = this.properties.getNumber('rotate');
    const translateX = this.properties.getNumber('translateX');
    const translateY = this.properties.getNumber('translateY');
    const backgroundColor = this.properties.get('backgroundColor');
    const radius = this.properties.getNumber('radius');
    const clip = this.properties.getBoolean('clip');
    const randomizeIds = this.properties.getBoolean('randomizeIds');

    // Create body
    const colorGradients = [...colors].map((colorName) =>
      this.createColorGradient(colorName),
    );
    const componentsSymbols = [...components].map((componentName) =>
      this.createComponentSymbol(componentName),
    );

    let svgBody = [
      '<defs>',
      ...colorGradients,
      '</defs>',
      ...componentsSymbols,
      this.style.getBody().content,
    ].join('');

    // Replace placeholders
    svgBody = this.replacePlaceholdersInBody(svgBody);

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

    // Create SVG
    const svgAttributes = SvgHelper.createAttrString(this.attributes.all());
    const svgMetadata = LicenseHelper.getLicenseAsXml(this.style.getMetadata());

    return `<svg ${svgAttributes}>${svgMetadata}${svgBody}</svg>`;
  }

  private replacePlaceholdersInBody(body: string): string {
    return body.replace(/\{\{([^}]+)\}\}/gi, (match, m1) => {
      const placeholder = this.properties.get(m1);

      if (typeof placeholder === 'string') {
        return SvgHelper.escape(placeholder);
      }

      return '';
    });
  }

  private createComponentSymbol(componentName: string) {
    const componentValueName = this.properties.get(componentName);
    const componentRotation = this.properties.get(`${componentName}Rotation`);
    const componentOffsetX = this.properties.get(`${componentName}OffsetX`);
    const componentOffsetY = this.properties.get(`${componentName}OffsetY`);

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

  private createColorGradient(colorName: string) {
    const colorValue = this.properties.get(`${colorName}Color`);

    if (!(colorValue instanceof ColorModel)) {
      return '';
    }

    return `<linearGradient id="color-${SvgHelper.escape(colorName)}"><stop stop-color="rgba(${colorValue.getRgba().join(', ')})"/></linearGradient>`;
  }

  private getDependencies(): Dependencies {
    const bodyDependencies = this.style.getBodyDependencies();

    const dependencies: Dependencies = {
      components: new Set(bodyDependencies.components),
      colors: new Set(bodyDependencies.colors),
    };

    const unprocessed = [...bodyDependencies.components];

    while (unprocessed.length > 0) {
      const component = unprocessed.pop()!;
      const componentValue = this.properties.get(component);

      // May not be a string if hidden component.
      if (typeof componentValue !== 'string') {
        continue;
      }

      const componentValueDependencies =
        this.style.getComponentValueDependencies(component, componentValue)!;

      for (const dependency of componentValueDependencies.components) {
        if (dependencies.components.has(dependency)) {
          continue;
        }

        dependencies.components.add(dependency);
        unprocessed.push(dependency);
      }

      for (const dependency of componentValueDependencies.colors) {
        dependencies.colors.add(dependency);
      }
    }

    return dependencies;
  }

  private defineCoreProperties(): this {
    const seed = this.options.getString('seed');
    const size = this.options.get('size');

    const backgroundColor = this.prng.pick(
      this.options.getArray('backgroundColor') as string[],
    );

    const backgroundColorModel = backgroundColor
      ? new ColorModel(backgroundColor)
      : null;

    this.properties.set('initials', StringHelper.getInitials(seed));
    this.properties.set('seed', seed);
    this.properties.set('flip', this.options.getBoolean('flip'));
    this.properties.set('rotate', this.options.getNumber('rotate'));
    this.properties.set('scale', this.options.getNumber('scale'));
    this.properties.set('radius', this.options.getNumber('radius'));
    this.properties.set('size', typeof size === 'number' ? size : null);
    this.properties.set('backgroundColor', backgroundColorModel);
    this.properties.set('translateX', this.options.getNumber('translateX'));
    this.properties.set('translateY', this.options.getNumber('translateY'));
    this.properties.set('clip', this.options.getBoolean('clip'));
    this.properties.set(
      'randomizeIds',
      this.options.getBoolean('randomizeIds'),
    );

    return this;
  }

  private defineColorProperties(): this {
    for (const color of this.style.getColors()) {
      const propertyKey = `${color.name}Color`;

      if (this.properties.has(propertyKey)) {
        // Ignore colors that are already set. `backgroundColor` for example is
        // filled in `fillCoreProperties`
        continue;
      }

      const optionValue = this.options.getArray(
        `${color.name}Color`,
      ) as string[];

      let availableColors = optionValue.map((c) => new ColorModel(c));

      if (color.notEqualTo) {
        for (const notEqualTo of color.notEqualTo) {
          const notEqualToColor = this.properties.get(`${notEqualTo}Color`);

          if (notEqualToColor instanceof ColorModel) {
            const newAvailableColors = availableColors.filter(
              (color) => notEqualToColor.getHex() !== color.getHex(),
            );

            if (newAvailableColors.length > 0) {
              availableColors = newAvailableColors;
            }
          }
        }
      }

      if (color.contrastTo) {
        const contrastTo = this.properties.get(`${color.contrastTo}Color`);

        if (contrastTo instanceof ColorModel) {
          const colorValue = ColorHelper.getContrastColor(
            contrastTo,
            availableColors,
          );

          if (colorValue) {
            availableColors = [colorValue];
          }
        }
      }

      this.properties.set(propertyKey, this.prng.pick(availableColors, null));
    }

    return this;
  }

  private defineComponentProperties(): this {
    for (const component of this.style.getComponents()) {
      const componentOption = this.options.getArray(component.name) as string[];

      this.properties.set(component.name, this.prng.pick(componentOption));

      if (component.probability !== undefined) {
        const componentProbabilityOption = this.options.getNumber(
          `${component.name}Probability`,
        );

        if (this.prng.bool(componentProbabilityOption)) {
          this.properties.set(`${component.name}Probability`, 100);
        } else {
          this.properties.set(`${component.name}Probability`, 0);
          this.properties.set(component.name, null);
        }
      }

      if (component.rotation !== undefined) {
        const componentRotationOption = this.options.getArray(
          `${component.name}Rotation`,
        ) as number[];

        this.properties.set(
          `${component.name}Rotation`,
          this.prng.integer(
            Math.min(...componentRotationOption),
            Math.max(...componentRotationOption),
          ),
        );
      }

      if (component.offset?.x !== undefined) {
        const componentOffsetXOption = this.options.getArray(
          `${component.name}OffsetX`,
        ) as number[];

        this.properties.set(
          `${component.name}OffsetX`,
          this.prng.integer(
            Math.min(...componentOffsetXOption),
            Math.max(...componentOffsetXOption),
          ),
        );
      }

      if (component.offset?.y !== undefined) {
        const componentOffsetYOption = this.options.getArray(
          `${component.name}OffsetY`,
        ) as number[];

        this.properties.set(
          `${component.name}OffsetY`,
          this.prng.integer(
            Math.min(...componentOffsetYOption),
            Math.max(...componentOffsetYOption),
          ),
        );
      }
    }

    return this;
  }

  private defineDefaultAttributes(): this {
    for (const { name, value } of this.style.getAttributes()) {
      this.attributes.set(name, value);
    }

    if (!this.attributes.has('xmlns')) {
      this.attributes.set('xmlns', 'http://www.w3.org/2000/svg');
    }

    if (!this.attributes.has('viewBox')) {
      this.attributes.set(
        'viewBox',
        `0 0 ${this.style.getBody().width} ${this.style.getBody().height}`,
      );
    }

    return this;
  }

  private defineSizeAttributes(): this {
    const targetSize = this.properties.get('size');

    if (typeof targetSize !== 'number') {
      return this;
    }

    const { width, height } = this.attributes.getViewBox();
    const aspectRatio = width / height;

    const newWidth = aspectRatio > 1 ? targetSize : targetSize * aspectRatio;
    const newHeight = aspectRatio > 1 ? targetSize / aspectRatio : targetSize;

    this.attributes.set('width', newWidth.toString());
    this.attributes.set('height', newHeight.toString());

    return this;
  }
}
