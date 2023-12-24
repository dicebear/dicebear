# Create an avatar style from Scratch

We highly recommend our
[Figma plugin](/guides/create-an-avatar-style-with-figma/) to create an avatar
style. Most of DiceBear official avatar styles were created with the plugin. But
with appropriate programming skills you can also create an avatar style without
Figma.

## Interfaces

```ts
interface AvatarStyle {
  meta?: {
    title?: string;
    source?: string;
    creator?: string;
    homepage?: string;
    license?: {
      name: string;
      url: string;
    };
  };
  schema?: JSONSchema7;
  create(props: { prng: Prng; options: object }): {
    attributes: {
      viewBox: string;
      [key: string]: string;
    };
    body: string;
  };
}

interface Prng {
  seed: string;
  bool(likelihood?: number): boolean;
  integer(min: number, max: number): number;
  pick<T>(arr: T[]): T | undefined;
  string(length: number, characters?: string): string;
}
```

## Minimal Example

A minimal example of an avatar style with a circle colored red or blue by the
PRNG based on a seed.

```ts
const style = {
  create: ({ prng, options }) => {
    const attributes = {
      viewBox: '0 0 100 100',
    };

    const fill = prng.bool() ? 'red' : 'blue';
    const body = `<circle cx="50" cy="50" r="50" fill="${fill}" />`;

    return { attributes, body };
  },
};
```

As you can see, it doesn't take much to create an avatar style. Both the
metadata and the JSON schema are optional. The `create` method takes the PRNG
and options and creates the avatar. What you do exactly in this function is up
to you.

If you specify metadata, it will be placed in the metadata of the created
avatars. If none are specified, the avatar's metadata is empty accordingly.

The JSON Schema object describes the allowed options that can be passed to the
`createAvatar` option. It is mainly used by the CLI, the API and the
documentation. So you can leave the object empty without any real disadvantages.
But it can help to document your avatar style.
