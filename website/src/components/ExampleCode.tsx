import * as React from 'react';
import * as styles from '@dicebear/collection';
import { StyleOptions } from '@dicebear/avatars';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { getApiPath } from '../utils/getApiPath';
import { getPackageName } from '../utils/getPackageName';

type Props = {
  style: keyof typeof styles;
  options: StyleOptions<any>;
};

export function ExampleCode({ style, options }: Props) {
  let apiPath = React.useMemo(() => getApiPath(style, options), [style, options]);
  let formattedOptions = React.useMemo(() => JSON.stringify(options, undefined, 2), [options]);
  let umdStyleName = React.useMemo(() => style.charAt(0).toUpperCase() + style.slice(1), [style]);
  let packageName = React.useMemo(() => getPackageName(style), [style]);

  return (
    <Tabs
      className="custom-tabs"
      defaultValue="es6"
      values={[
        { label: 'ES6', value: 'es6' },
        { label: 'CommonJS', value: 'commonjs' },
        { label: 'CDN', value: 'cdn' },
        { label: 'API', value: 'api' },
      ]}
    >
      <TabItem value="es6">
        <p className="tw-mb-1">
          1. Install <span className="tw-font-medium">DiceBear</span> and the avatar style{' '}
          <span className="tw-font-medium">{style}</span> with npm:
        </p>
        <CodeBlock className="bash">{`npm install --save @dicebear/avatars ${packageName}`}</CodeBlock>
        <p className="tw-mb-1">
          2. Now you are ready to create your <span className="tw-font-medium">{style}</span> avatar:
        </p>
        <CodeBlock className="language-javascript">
          {`
import { createAvatar } from '@dicebear/avatars';
import * as style from '${packageName}';

const svg = createAvatar(
  style,
${formattedOptions.replace(/^/gm, '  ')}
);
`.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="commonjs">
        <p className="tw-mb-1">
          1. Install <span className="tw-font-medium">DiceBear</span> and the avatar style{' '}
          <span className="tw-font-medium">{style}</span> with npm:
        </p>
        <CodeBlock className="bash">{`npm install --save @dicebear/avatars ${packageName}`}</CodeBlock>
        <p className="tw-mb-1">
          2. Now you are ready to create your <span className="tw-font-medium">{style}</span> avatar:
        </p>
        <CodeBlock className="language-javascript">
          {`
const { createAvatar } = require('@dicebear/avatars');
const style = require('${packageName}');

const svg = createAvatar(
  style,
${formattedOptions.replace(/^/gm, '  ')}
);
`.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="cdn">
        <p className="tw-mb-1">
          1. Paste the following code into the <code>&lt;head&gt;</code> of your document, to load{' '}
          <span className="tw-font-medium">DiceBear</span> and the avatar style{' '}
          <span className="tw-font-medium">{style}</span>:
        </p>
        <CodeBlock className="language-html">
          {`
<script src="https://unpkg.com/@dicebear/avatars@^4.7/dist/index.umd.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@dicebear/${packageName}@^4.7/dist/index.umd.js" crossorigin="anonymous"></script>
`.trim()}
        </CodeBlock>

        <p className="tw-mb-1">
          2. Now you are ready to create your <span className="tw-font-medium">{style}</span> avatar:
        </p>
        <CodeBlock className="language-html">
          {`
<script>
  const svg = DiceBear.createAvatar(
    DiceBear.${umdStyleName},
${formattedOptions.replace(/^/gm, '    ')}
  );
</script>
`.trim()}
        </CodeBlock>
      </TabItem>
      <TabItem value="api">
        <p className="tw-mb-1">
          You can also create your <span className="tw-font-medium">{style}</span> avatar with our API. Just use the
          following address as image source:
        </p>
        <CodeBlock>{apiPath}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
