import * as React from 'react';
import Link from '@docusaurus/Link';
import { PropsWithChildren } from 'react';

type Props = {
  href: string;
};

export function HeaderNavItem({ href, children }: PropsWithChildren<Props>) {
  return (
    <Link
      to={href}
      className="tw-text-lg tw-font-medium tw-py-2 tw-px-4 tw-ml-2 tw-rounded-md tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-bg-gray-100 hover:tw-no-underline"
    >
      {children}
    </Link>
  );
}
