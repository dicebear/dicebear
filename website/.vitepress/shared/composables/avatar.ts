import mergeAllOf from 'json-schema-merge-allof';
import { schema, StyleMeta, StyleSchema } from '@dicebear/core';
import { AvatarStyle, ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { computed, Ref, unref } from 'vue';

export function useAvatarStyleFromOptions(
  avatarStyleName: string | Ref<string>
): Ref<AvatarStyle | undefined> {
  const data = useData<ThemeOptions>();

  return computed(() => {
    const avatarStyleNameRaw = unref(avatarStyleName);

    return data.theme.value.avatarStyles[avatarStyleNameRaw];
  });
}

export function useAvatarStyleMeta(
  avatarStyleName: string | Ref<string>
): Ref<StyleMeta | undefined> {
  const avatarStyle = useAvatarStyleFromOptions(avatarStyleName);

  return computed(() => {
    const avatarStyleRaw = unref(avatarStyle);

    return avatarStyleRaw?.meta;
  });
}

export function useAvatarStyleSchema(
  avatarStyleName: string | Ref<string>
): Ref<StyleSchema | undefined> {
  const avatarStyle = useAvatarStyleFromOptions(avatarStyleName);

  return computed(() => {
    const avatarStyleRaw = unref(avatarStyle);

    if (undefined === avatarStyleRaw) {
      return undefined;
    }

    const coreSchema: StyleSchema = JSON.parse(JSON.stringify(schema));
    const styleSchema: StyleSchema = JSON.parse(
      JSON.stringify(avatarStyleRaw.schema)
    );

    // If both core schema and style schema provide examples, we want to keep only the style schema examples.
    for (const key in coreSchema.properties) {
      if (false === coreSchema.properties.hasOwnProperty(key)) {
        continue;
      }

      const coreValue = coreSchema.properties[key];
      const styleValue = styleSchema.properties![key];

      if (
        typeof coreValue === 'object' &&
        typeof styleValue === 'object' &&
        styleValue.examples !== undefined
      ) {
        coreValue.examples = undefined;
      }
    }

    return mergeAllOf(
      {
        allOf: [coreSchema, styleSchema],
      },
      { ignoreAdditionalProperties: true }
    );
  });
}

export function useAvatarStyleDefaults(
  avatarStyleName: Ref<string> | string
): Ref<Record<string, any> | undefined> {
  const avatarStyleSchema = useAvatarStyleSchema(avatarStyleName);

  return computed(() => {
    const avatarStyleSchemaRaw = unref(avatarStyleSchema);

    if (undefined === avatarStyleSchemaRaw) {
      return undefined;
    }

    let defaults: Record<string, any> = {};

    if (avatarStyleSchemaRaw.properties) {
      for (let key in avatarStyleSchemaRaw.properties) {
        let property = avatarStyleSchemaRaw.properties[key];

        if (
          typeof property === 'object' &&
          'default' in property &&
          property.default !== undefined
        ) {
          if (Array.isArray(property.default)) {
            defaults[key] = property.default.sort();
          } else {
            defaults[key] = property.default;
          }
        }
      }
    }

    return defaults;
  });
}
