import * as React from 'react';
import Link from 'next/link';

import { Meta } from '../types/meta';

import './index.scss';

type Props = {
  meta: Meta;
};

export default class Layout extends React.Component<Props> {
  render() {
    return (
      <div className="d-flex flex-column">
        <div>{this.props.children}</div>
        <div className="container align-self-end">
          <hr className="m-0" />
          <div className="d-flex flex-column flex-md-row justify-content-between py-2 text-muted">
            <div className="text-center text-md-left mb-3 mb-md-0">
              Documentation realized with <a href="https://github.com/zeit/next.js/">next.js</a>,{' '}
              <a href="https://reactjs.org/">react</a>, <a href="https://getbootstrap.com/">bootstrap</a> and{' '}
              <a href="https://octicons.github.com/">octicons</a>.
            </div>
            {this.props.meta.privacy_policy || this.props.meta.legal_notice ? (
              <ul className="list-inline m-0 text-center text-md-left">
                <li className="list-inline-item mr-0 ml-4">
                  <Link prefetch href="/">
                    <a>Home</a>
                  </Link>
                </li>
                {this.props.meta.privacy_policy ? (
                  <li className="list-inline-item mr-0 ml-4">
                    <Link prefetch href="/privacy-policy">
                      <a>Privacy Policy</a>
                    </Link>
                  </li>
                ) : (
                  ''
                )}
                {this.props.meta.legal_notice ? (
                  <li className="list-inline-item mr-0 ml-4">
                    <Link prefetch href="/legal-notice">
                      <a>Legal Notice / Impressum</a>
                    </Link>
                  </li>
                ) : (
                  ''
                )}
              </ul>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}
