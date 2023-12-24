# How to use the library with React Native?

To use DiceBear with [React Native](https://reactnative.dev/) you need an SVG
library to render the avatars. In our example we use the package
[react-native-svg](https://www.npmjs.com/package/react-native-svg).

First install the required packages:

```
npm install react-native-svg
```

A working example looks like this:

```jsx
import { View } from 'react-native';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';

export default function App() {
  const avatar = createAvatar(lorelei, {
    seed: 'Kitty',
    // ... other options
  }).toString();

  return (
    <View>
      <SvgXml xml={avatar} />
    </View>
  );
}
```
