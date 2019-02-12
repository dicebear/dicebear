import React from 'react';
import * as http from 'http';

import Layout from '../layout';

import { Meta } from '../types/meta';
import { getMetaData } from '../server/helper/meta';

import ReactChartkick, { AreaChart } from 'react-chartkick';
import Chart from 'chart.js';

ReactChartkick.addAdapter(Chart);

type Props = {
  meta: Meta;
};

export default class LegalNotice extends React.Component<Props> {
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
        <div className="container">
          <h1 className="my-4">HTTP-API Stats</h1>
          <div className="row mb-5">
            <div className="col-lg-9 mb-3 mb-lg-0">
              <div className="rounded bg-light p-3">
                <AreaChart data={this.props.meta.stats.line} thousands="," />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="rounded bg-light py-3 text-center">
                <p className="mb-0">Total requests</p>
                <div className="display-2 mb-1">
                  {new Intl.NumberFormat('en-US').format(this.props.meta.stats.total.sum)}
                </div>
                <p className="text-muted mb-0">since {this.props.meta.stats.total.since}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
