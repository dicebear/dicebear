import React from 'react';
import * as http from 'http';

import Layout from '../layout';
import Teaser from '../components/teaser';
import Introductions from '../components/introductions';
import SpriteCollections from '../components/spriteCollections';
import Faq from '../components/faq';

import { Meta } from '../../types/meta';
import { getMetaData } from '../../server/helper/meta';
import publicConfig from '../config/public';
import { PublicConfigSpriteCollection } from '../../types/publicConfig';

if (process.env.IS_BROWSER) {
  require('whatwg-fetch');
}

type Props = {
  meta: Meta;
};

type State = {
  avatars: PublicConfigSpriteCollection[];
};

export default class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      avatars: publicConfig.spriteCollections.v3
    };
  }

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

  render() {
    return (
      <Layout meta={this.props.meta}>
        <Teaser meta={this.props.meta} />
        <Introductions meta={this.props.meta} />
        <SpriteCollections meta={this.props.meta} avatars={this.state.avatars} />
        <Faq />
      </Layout>
    );
  }
}
