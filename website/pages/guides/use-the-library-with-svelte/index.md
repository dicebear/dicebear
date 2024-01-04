# How to use the library with Svelte?

It is quite easy to use the [JS-Library](/how-to-use/js-library/) in Svelte. We
convert the SVG to a data URI and use it as the `src`.

```svelte
<script>
  import { createAvatar } from "@dicebear/core";
  import { lorelei } from "@dicebear/collection";

  let avatar = createAvatar(lorelei, {
    size: 128,
    // ... other options
  }).toDataUri();
</script>

<img src={avatar} alt="Avatar" />
```
