# How to use the library with Vue?

To use the [JS-Library](/how-to-use/js-library/) with Vue, we need to convert
the SVG to a data URI and use it as the `src`.

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  size: 128,
  // ... other options
}).toDataUri();
</script>

<template>
  <img :src="avatar" alt="Avatar" />
</template>
```
