import React from 'react';
import * as http from 'http';

import Layout from '../layout';

import { Meta } from '../types/meta';
import { getMetaData } from '../server/helper/meta';

type Props = {
  meta: Meta;
};

export default class PrivacyPolicy extends React.Component<Props> {
  static async getInitialProps(ctx: { req: http.IncomingMessage }) {
    let meta: Meta;

    if (ctx.req) {
      meta = await getMetaData();
    } else {
      let response = await fetch('/meta.json');

      meta = await response.json();
    }

    return {
      meta: meta
    };
  }

  onChangeSeed(seed: string) {
    this.setState({
      seed: seed
    });
  }

  render() {
    return (
      <Layout meta={this.props.meta}>
        <div className="container py-3" dangerouslySetInnerHTML={{ __html: this.props.meta.privacy_policy }} />
      </Layout>
    );
  }
}
