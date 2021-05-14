import * as React from 'react';

import { FooterLink } from './FooterLink';
import { FooterBunnyNet } from './FooterBunnyNet';

type Props = {};

export function Footer({}: Props) {
  return (
    <footer className="tw-bg-gray-900">
      <div className="tw-container tw-py-16">
        <div className="tw-row">
          <div className="tw-col-4">
            <h5 className="tw-text-white tw-text-lg tw-leading-snug tw-font-semibold tw-mb-8">
              &copy; 2021 Florian Körner
            </h5>
            <p className="tw-text-sm tw-leading-snug tw-text-gray-400">
              This site uses the following{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="blank"
                className="tw-font-semibold hover:tw-underline hover:tw-text-gray-400"
              >
                CC BY 4.0
              </a>{' '}
              licensed work:{' '}
              <a
                href="https://www.figma.com/community/file/829741575478342595"
                target="blank"
                className="tw-font-semibold hover:tw-underline hover:tw-text-gray-400"
              >
                Avatar Design System
              </a>{' '}
              by Micah Lanier. This site also uses{' '}
              <a
                href="https://primer.style/octicons/"
                target="blank"
                className="tw-font-semibold hover:tw-underline hover:tw-text-gray-400"
              >
                Octinons
              </a>{' '}
              by GitHub (Licensed under MIT).
            </p>
          </div>
          <div className="tw-col-5 tw-flex tw-justify-around">
            <div>
              <h5 className="tw-text-white tw-text-lg tw-leading-snug tw-font-semibold tw-mb-8">Community</h5>
              <ul>
                <li className="tw-mb-3">
                  <FooterLink href="https://github.com/dicebear/dicebear">GitHub</FooterLink>
                </li>
                <li className="tw-mb-3">
                  <FooterLink href="https://dicebear.betteruptime.com">Status</FooterLink>
                </li>
                <li>
                  <FooterLink href="https://twitter.com/dicebearcom">Twitter</FooterLink>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="tw-text-white tw-text-lg tw-leading-snug tw-font-semibold tw-mb-8">Legal</h5>
              <ul>
                <li className="tw-mb-3">
                  <FooterLink to="/legal/site-notice">Site Notice</FooterLink>
                </li>
                <li className="tw-mb-3">
                  <FooterLink to="/legal/privacy-policy">Privacy Policy</FooterLink>
                </li>
                <li>
                  <FooterLink to="/licenses">Licenses</FooterLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="tw-col-3">
            <h5 className="tw-text-white tw-text-lg tw-leading-snug tw-font-semibold tw-mb-8">Sponsored by</h5>
            <a href="https://bunny.net/" target="_blank">
              <FooterBunnyNet />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
