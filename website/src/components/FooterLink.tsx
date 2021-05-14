import * as React from 'react';
import Link from '@docusaurus/Link';

type Props = {
  to?: string;
  href?: string;
};

export function FooterLink({ to, href, children }: React.PropsWithChildren<Props>) {
  const className = 'tw-text-white hover:tw-underline hover:tw-text-white';

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
