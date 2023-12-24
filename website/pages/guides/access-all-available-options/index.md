# How to programmatically access all available options of an avatar style?

Each official avatar style provides a [JSON schema](https://json-schema.org/)
that you can use to validate your options. But you can also use this JSON to
find out what options are available to you.

Here is a small example of how to access all the options of an avatar style.

```js
import { schema } from '@dicebear/core';
import { micah } from '@dicebear/collection';

const options = {
  ...schema.properties,
  ...micah.schema.properties,
};

console.log(options);
```

Also for this documentation and the CLI, we are parsing this JSON schema to show
all the available options.

Example:
https://github.com/dicebear/dicebear/blob/main/packages/dicebear/src/utils/getOptionsBySchema.ts
