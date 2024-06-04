import { Struct } from 'superstruct';
import { DependencyHelper } from '../helpers/DependencyHelper.js';
import type {
  Definition,
  DefinitionAttributeList,
  DefinitionBody,
  DefinitionColor,
  DefinitionColorList,
  DefinitionComponent,
  DefinitionComponentList,
  DefinitionComponentValue,
  DefinitionMetadata,
  Dependencies,
  StyleOptions,
} from '../types.js';
import { StructHelper } from '../helpers/StructHelper.js';
import { ObjectSchema } from 'superstruct/dist/utils.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class StyleModel<S extends StyleOptions = StyleOptions> {
  private readonly struct: Struct<{ [x: string]: unknown }, ObjectSchema>;

  private readonly colors: Map<string, DefinitionColor>;
  private readonly components: Map<string, DefinitionComponent>;
  private readonly componentValues: Map<string, DefinitionComponentValue>;

  private readonly bodyDependencies: Dependencies;
  private readonly componentValueDependencies: Map<string, Dependencies>;

  constructor(private readonly definition: Definition) {
    this.colors = this.indexColors();
    this.components = this.indexComponents();
    this.componentValues = this.indexComponentValues();

    this.struct = StructHelper.createOptionsStruct(this);

    this.bodyDependencies = DependencyHelper.getFromSvg(this.getBody().content);
    this.componentValueDependencies = this.indexComponentValueDependencies();
  }

  getMetadata(): Exclude<DefinitionMetadata, undefined> {
    return this.definition.metadata ?? {};
  }

  getBody(): DefinitionBody {
    return this.definition.body;
  }

  getAttributes(): Exclude<DefinitionAttributeList, undefined> {
    return this.definition.attributes ?? [];
  }

  getComponents(): Exclude<DefinitionComponentList, undefined> {
    return this.definition.components ?? [];
  }

  getColors(): Exclude<DefinitionColorList, undefined> {
    return this.definition.colors ?? [];
  }

  getStruct(): Struct<{ [x: string]: unknown }, ObjectSchema> {
    return this.struct;
  }

  getColorByName(colorName: string): DefinitionColor | undefined {
    return this.colors.get(colorName);
  }

  getComponentByName(componentName: string): DefinitionComponent | undefined {
    return this.components.get(componentName);
  }

  getComponentValueByName(
    componentName: string,
    name: string,
  ): DefinitionComponentValue | undefined {
    return this.componentValues.get(`${componentName}:${name}`);
  }

  getBodyDependencies(): Dependencies {
    return this.bodyDependencies;
  }

  getComponentValueDependencies(
    componentName: string,
    name: string,
  ): Dependencies | undefined {
    return this.componentValueDependencies.get(`${componentName}:${name}`);
  }

  private indexColors(): Map<string, DefinitionColor> {
    const result = new Map<string, DefinitionColor>();

    for (const color of this.getColors()) {
      result.set(color.name, color);
    }

    return result;
  }

  private indexComponents(): Map<string, DefinitionComponent> {
    const result = new Map<string, DefinitionComponent>();

    for (const component of this.getComponents()) {
      result.set(component.name, component);
    }

    return result;
  }

  private indexComponentValues(): Map<string, DefinitionComponentValue> {
    const result = new Map<string, DefinitionComponentValue>();

    for (const component of this.getComponents()) {
      for (const componentValue of component.values) {
        result.set(`${component.name}:${componentValue.name}`, componentValue);
      }
    }

    return result;
  }

  private indexComponentValueDependencies(): Map<string, Dependencies> {
    const result = new Map<string, Dependencies>();

    for (const component of this.getComponents()) {
      for (const componentValue of component.values) {
        result.set(
          `${component.name}:${componentValue.name}`,
          DependencyHelper.getFromSvg(componentValue.content),
        );
      }
    }

    return result;
  }
}
