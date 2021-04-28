import * as React from 'react';
import Link from '@docusaurus/Link';
import { MarkGithubIcon } from '@primer/octicons-react';
import HeaderNavItem from './HeaderNavItem';
import HeaderLogo from './HeaderLogo';

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="tw-container tw-h-32 tw-flex tw-items-center tw-z-10">
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
    </header>
  );
}
