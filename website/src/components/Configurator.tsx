import * as React from 'react';
import { Editor } from '@dicebear/editor';
import toReact from 'svelte-adapter/react';

type Props = {};

const ReactEditor = toReact(Editor);

export function Configurator({}: Props) {
  return (
    <div className="container">
      <div className="tw-row">
        <div className="tw-col-8">
          <ReactEditor />
        </div>

        <div className="tw-col-4">Result</div>
      </div>
    </div>
  );
}
