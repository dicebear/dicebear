import React from 'react';
import * as http from 'http';
import * as socketio from 'socket.io-client';

import Layout from '../layout';

import { Meta } from '../types/meta';
import { getMetaData } from '../server/helper/meta';

import ReactChartkick, { AreaChart } from 'react-chartkick';
import Chart from 'chart.js';
import { Stats } from '../types/mongodb';

ReactChartkick.addAdapter(Chart);

type Props = {
  meta: Meta;
};

type State = {
  stats?: Stats;
};

export default class LegalNotice extends React.Component<Props, State> {
  state: State = {};

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

  componentDidMount() {
    socketio().on('data', (data: Stats) => {
      this.setState({
        stats: data
      });
    });
  }

  render() {
    return (
      <Layout meta={this.props.meta}>
        <div className="container">
          <h1 className="my-4">HTTP-API Stats</h1>
          {this.state.stats ? (
            <div className="row mb-5">
              <div className="col-lg-9 mb-3 mb-lg-0">
                <div className="rounded bg-light p-3">
                  <AreaChart data={this.state.stats.line} thousands="," />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="rounded bg-light py-3 text-center">
                  <p className="mb-0">Total requests</p>
                  <div className="display-2 mb-1">
                    {new Intl.NumberFormat('en-US').format(this.state.stats.total.sum)}
                  </div>
                  <p className="text-muted mb-0">since {this.state.stats.total.since}</p>
                </div>
              </div>
            </div>
          ) : (
            'Loading'
          )}
        </div>
      </Layout>
    );
  }
}
