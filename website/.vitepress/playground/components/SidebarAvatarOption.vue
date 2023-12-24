<script setup lang="ts">
import { capitalCase } from 'change-case';
import useStore from '../store';
import { JSONSchema7 } from 'json-schema';
import { computed } from 'vue';
import Avatar from '@shared/components/Avatar.vue';
import { getAvatarPropertyPreviewOptions } from '@shared/utils/avatar';

const props = defineProps<{
  field: string | number;
  schema: JSONSchema7;
}>();

const store = useStore();

const label = computed(() => {
  return capitalCase(props.field.toString());
});

const hint = computed(() => {
  if (props.field === 'backgroundRotation') {
    return 'The PRNG generates a number between the smallest and largest value.';
  }

  return undefined;
});

const suffix = computed(() => {
  const field = props.field.toString();

  return (
    [
      ['%', field.match(/Probability$/)],
      ['%', field === 'scale'],
      ['%', field.match(/^translate/)],
      ['%', field === 'radius'],
      ['°', field === 'rotate' || field === 'backgroundRotation'],
      ['', true],
    ].find(([, match]) => match)?.[0] ?? ''
  );
});

const options = computed(() => {
  let result: Map<
    unknown,
    {
      value: unknown;
      label: string;
    }
  > = new Map();

  if (props.schema.type === 'boolean') {
    result.set(true, {
      value: true,
      label: 'true',
    });
    result.set(false, {
      value: false,
      label: 'false',
    });
  }

  if (props.schema.type === 'integer') {
    const minimum = props.schema.minimum || 0;
    const maximum = props.schema.maximum || 100;

    let step = 10;

    if (maximum <= 100) {
      step = 5;
    }

    if (maximum <= 10) {
      step = 1;
    }

    for (let i = minimum; i <= maximum; i += step) {
      result.set(i, {
        value: i,
        label: `${i}${suffix.value}`,
      });
    }
  }

  if (
    typeof props.schema.items === 'object' &&
    'enum' in props.schema.items &&
    props.schema.items.enum
  ) {
    for (const value of props.schema.items.enum) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        result.set(value, {
          value: value,
          label: `${value}${suffix.value}`,
        });
      }
    }
  }

  if (props.schema.enum) {
    for (const value of props.schema.enum) {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        result.set(value, {
          value: value,
          label: `${value}${suffix.value}`,
        });
      }
    }
  }

  if (
    typeof props.schema.items === 'object' &&
    'type' in props.schema.items &&
    props.schema.items.type === 'integer'
  ) {
    const minimum = props.schema.items.minimum || 0;
    const maximum = props.schema.items.maximum || 100;

    let step = 10;

    if (maximum <= 100) {
      step = 5;
    }

    if (maximum <= 10) {
      step = 1;
    }

    for (let i = minimum; i <= maximum; i += step) {
      result.set(i, {
        value: i,
        label: `${i}${suffix.value}`,
      });
    }
  }

  if (props.schema.default) {
    if (Array.isArray(props.schema.default)) {
      for (const value of props.schema.default) {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          result.set(value, {
            value: value,
            label: `${value}${suffix.value}`,
          });
        }
      }
    } else {
      const value = props.schema.default;

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        result.set(value, {
          value: value,
          label: `${value}${suffix.value}`,
        });
      }
    }
  }

  if (props.field === 'backgroundColor') {
    for (const example of ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']) {
      result.set(example, {
        value: example,
        label: example,
      });
    }
  }

  if (props.field.toString().match(/Color$/)) {
    result.set('transparent', {
      value: 'transparent',
      label: 'transparent',
    });
  }

  return Array.from(result.values()).sort((a, b) => {
    if (typeof a.value === 'number' && typeof b.value === 'number') {
      return a.value - b.value;
    }

    if (typeof a.label === 'string' && typeof b.label === 'string') {
      return a.label.localeCompare(b.label);
    }

    return 0;
  });
});

const multiple = computed(() => {
  return props.schema.type === 'array';
});

const isLimited = computed(() => {
  return !!props.schema.maxItems;
});
</script>

<template>
  <template v-if="options.length > 1 && !isLimited">
    <v-label class="mb-2" :for="field">{{ label }}</v-label>
    <v-select
      :id="field.toString()"
      :items="options"
      item-title="label"
      item-value="value"
      v-model="store.avatarStyleOptions[props.field]"
      :hide-details="!hint"
      :hint="hint"
      persistent-hint
      variant="solo"
      :multiple="multiple"
      :clearable="multiple"
      density="compact"
      :menu-props="{ maxHeight: '325px' }"
    >
      <template v-if="multiple" v-slot:selection="{ item, index }">
        <span v-if="index == 0">{{ item.title }}</span>
        <span v-if="index == 1" class="text-grey align-self-center">
          &nbsp;+{{ store.avatarStyleOptions[props.field].length - 1 }}
        </span>
      </template>

      <template #item="item">
        <v-list-item :key="item.index" v-bind="item.props">
          <template #prepend="slotProps">
            <v-checkbox-btn
              v-if="multiple"
              :modelValue="slotProps.isSelected"
              :ripple="false"
            />
          </template>

          <template #append>
            <Avatar
              v-if="!field.toString().match(/Probability$/)"
              :size="32"
              :style-name="store.avatarStyleName"
              :style-options="
                getAvatarPropertyPreviewOptions(
                  field.toString(),
                  item.item.value
                )
              "
              class="ml-3"
            />
          </template>
        </v-list-item>
      </template>
    </v-select>
  </template>
</template>
