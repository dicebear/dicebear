import * as React from 'react';
import { Editor } from '@dicebear/editor';
import * as styles from '@dicebear/collection';
import { createAvatar, StyleOptions } from '@dicebear/avatars';
import { ExampleCode } from './ExampleCode';
import { Button } from './Button';
import { ShareAndroidIcon, DuplicateIcon } from '@primer/octicons-react';
import { downloadPng } from '../utils/downloadPng';
import { getFilename } from '../utils/getFilename';
import { getApiPath } from '../utils/getApiPath';
import { Link } from '@docusaurus/router';
import clsx from 'clsx';

type Props = {};

export function Configurator({}: Props) {
  const [mode, setMode] = React.useState<'prng' | 'fixed'>('prng');
  const [style, setStyle] = React.useState(Object.keys(styles)[0] as keyof typeof styles);
  const [options, setOptions] = React.useState<StyleOptions<any>>({
    seed: 'John Doe',
  });

  const meta = React.useMemo(() => styles[style].meta, [style]);
  const apiPath = React.useMemo(() => getApiPath(style, options), [style, options]);
  const container = React.useRef<HTMLDivElement>(null);
  const component = React.useRef<Editor>(null);
  const avatarUri = React.useMemo(
    () => createAvatar(styles[style], { ...options, dataUri: true, base64: false }),
    [style, options]
  );
  const creator = React.useMemo(() => {
    if (Array.isArray(meta.creator)) {
      return meta.creator.join(', ');
    }

    return meta.creator;
  }, [meta]);

  React.useEffect(() => {
    if (container.current) {
      component.current = new Editor({
        target: container.current,
        props: {
          style: styles[style],
          mode: mode,
        },
      });

      return () => {
        component.current.$destroy();
        component.current = null;
      };
    }
  }, [container.current, style, mode]);

  return (
    <div className="tw-container">
      <div className="tw-row">
        <div className="tw-col-7">
          <div className="tw-font-medium tw-border-b-2 tw-mb-4 tw-py-0.5">Mode</div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-8">
            <div
              className={clsx(
                'tw-rounded tw-py-2 tw-px-3 tw-border tw-cursor-pointer tw-transition-colors tw-duration-75',
                mode === 'prng' ? 'tw-border-blue-400 tw-bg-blue-50' : 'tw-border-gray-200 hover:tw-border-blue-400'
              )}
              onClick={() => setMode('prng')}
            >
              <div className="tw-font-medium">PRNG Mode</div>
              <div>Create avatars with the PRNG using a seed.</div>
            </div>
            <div
              className={clsx(
                'tw-rounded tw-py-2 tw-px-3 tw-border tw-cursor-pointer tw-transition-colors tw-duration-75',
                mode === 'fixed' ? 'tw-border-blue-400 tw-bg-blue-50' : 'tw-border-gray-200 hover:tw-border-blue-400'
              )}
              onClick={() => setMode('fixed')}
            >
              <div className="tw-font-medium">Fixed Mode</div>
              <div>Create your individual avatar piece by piece.</div>
            </div>
          </div>
          <div className="tw-font-medium tw-border-b-2 tw-mb-4 tw-py-0.5">Style</div>
          <div className="tw-grid tw-grid-cols-6 tw-gap-4 tw-mb-8">
            {Object.keys(styles).map((key) => {
              return (
                <div
                  key={key}
                  className={clsx(
                    'tw-rounded tw-p-2 tw-pb-1 tw-border tw-cursor-pointer tw-transition-colors tw-duration-75',
                    style === key ? 'tw-border-blue-400 tw-bg-blue-50' : 'tw-border-gray-200 hover:tw-border-blue-400'
                  )}
                  onClick={() => setStyle(key as keyof typeof styles)}
                >
                  <img
                    src={createAvatar(styles[key], { seed: 'John Doe', dataUri: true })}
                    alt={key}
                    className="tw-mb-1"
                  />
                  <div className="tw-text-center tw-text-sm">{key}</div>
                </div>
              );
            })}
          </div>
          <div ref={container} />
        </div>

        <div className="tw-col-5 fw-sticky tw-top-0">
          <div className="tw-row tw-mb-7">
            <div className="tw-col-5">
              <a href={apiPath} target="_blank" rel="noopener noreferrer">
                <img src={avatarUri} className="tw-bg-transparent-pattern" />
              </a>
            </div>
            <div className="tw-col-7 tw-flex tw-flex-col tw-justify-between">
              <div>
                <Button
                  href={avatarUri}
                  download={getFilename(options.seed)}
                  block
                  style="secondary"
                  className="tw-mb-2"
                >
                  Download SVG
                </Button>
                <Button onClick={() => downloadPng(styles[style], options)} block style="secondary">
                  Download PNG
                </Button>
              </div>
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                <div>
                  <Button onClick={() => {}} block style="secondary">
                    Copy
                    <DuplicateIcon className="tw-ml-2" />
                  </Button>
                </div>
                <div>
                  <Button href={apiPath} block style="secondary">
                    Share <ShareAndroidIcon className="tw-ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="tw-mb-5 tw-text-gray-500 tw-bg-gray-100 tw-py-2 tw-px-3 tw-rounded-md tw-text-sm">
            Avatar style{' '}
            <Link to={`/styles/${style}`} className="tw-font-medium">
              {style}
            </Link>{' '}
            is based on{' '}
            <a href={meta.source} target="_blank" rel="noopener noreferrer" className="tw-font-medium">
              {meta.title} by {creator}
            </a>
            . Licensed under{' '}
            <a href={meta.license.url} target="_blank" rel="noopener noreferrer" className="tw-font-medium">
              {meta.license.name}
            </a>
            . You can find an overview of all licenses on our{' '}
            <Link to="/licenses" className="tw-font-medium">
              license page
            </Link>
            .
          </p>

          <ExampleCode style={style} options={options} />
        </div>
      </div>
    </div>
  );
}
