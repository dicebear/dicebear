import * as React from 'react';
import Link from '@docusaurus/Link';
import { MarkGithubIcon } from '@primer/octicons-react';
import { HeaderNavItem } from './HeaderNavItem';
import { HeaderLogo } from './HeaderLogo';
import clsx from 'clsx';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

type Props = {};

export function Header({}: Props) {
  let [small, setSmall] = React.useState(false);

  useScrollPosition(({ prevPos, currPos }) => {
    let isScrolled = currPos.y <= -24;

    if (isScrolled !== small) {
      setSmall(isScrolled);
    }
  });

  return (
    <header
      className={clsx(
        'tw-z-10 tw-bg-white tw-transition-all tw-duration-150 tw-ease-in-out tw-border-b tw-sticky tw-top-0 tw-mt-6 tw-mb-12',
        small ? ' tw-border-gray-200' : ' tw-border-white'
      )}
    >
      <div className={clsx('tw-container tw-flex tw-items-center tw-h-20')}>
        <Link
          to="/"
          className="tw-text-gray-900 hover:tw-text-light-blue-600 tw-transition-colors tw-duration-150 tw-ease-in-out"
        >
          <HeaderLogo />
        </Link>
        <div className="tw-ml-auto tw-flex tw-items-center">
          <ul className="tw-flex">
            <li>
              <HeaderNavItem href="/docs">Documentation</HeaderNavItem>
            </li>
            <li>
              <HeaderNavItem href="/configurator">Configurator</HeaderNavItem>
            </li>
            <li>
              <HeaderNavItem href="/styles">Styles</HeaderNavItem>
            </li>
          </ul>
          <a href="https://github.com/DiceBear/avatars" target="_blank" className="tw-ml-6">
            <MarkGithubIcon className="tw-h-10 tw-w-10 hover:tw-text-light-blue-600 tw-transition-colors tw-duration-150 tw-ease-in-out" />
          </a>
        </div>
      </div>
    </header>
  );
}
