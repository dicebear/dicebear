# How to use the library without ESM?

The library is a pure
[ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules).
[Sindre Sorhus](https://github.com/sindresorhus) has written a great
[help page](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
if you are new to ESM packages.

If you don't use or can't use ESM, you can use the asynchronous `import`
function.

```js{1,2}
const { createAvatar } = await import('@dicebear/core');
const { lorelei } = await import('@dicebear/collection');

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const svg = avatar.toString();
```
