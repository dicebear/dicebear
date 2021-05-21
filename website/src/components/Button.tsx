import { Link } from '@docusaurus/router';
import clsx from 'clsx';
import * as React from 'react';

type Props = {
  block?: boolean;
  size?: 'md' | 'lg';
  style?: 'primary' | 'secondary';
  onClick?: () => void;
  href?: string;
  to?: string;
  className?: string;
  download?: string;
};

export function Button({
  children,
  onClick,
  href,
  to,
  block = false,
  size = 'md',
  style = 'primary',
  download,
  className,
}: React.PropsWithChildren<Props>) {
  className = clsx(
    className,
    'tw-font-size-lg tw-font-medium tw-justify-center tw-items-center tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-no-underline',
    size === 'md' && 'tw-rounded-md tw-px-4 tw-py-3',
    size === 'lg' && 'tw-rounded-lg tw-px-5 tw-py-4',
    style === 'primary' && 'tw-bg-gray-900 hover:tw-bg-gray-800 tw-text-white hover:tw-text-white',
    style === 'secondary' && 'tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-900 hover:tw-text-gray-900',
    block ? 'tw-flex tw-w-full' : 'tw-inline-flex'
  );

  if (onClick) {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer" download={download}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}
