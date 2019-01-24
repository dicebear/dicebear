import * as React from 'react';

import { GoBook } from 'react-icons/go';

import { MetaSpriteCollection } from '../../types/meta';

type Props = MetaSpriteCollection;

export default class SpriteCollection extends React.Component<Props> {
  render() {
    return (
      <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="row pb-2">
            <div className="offset-3 col-6">
              <img src={`/v3/${this.props.id}/seed.svg`} alt={this.props.id} />
            </div>
          </div>
          <h3 className="display-3 text-center mb-0">{this.props.id}</h3>
          <p className="text-muted text-center mb-5">{this.props.name}</p>
        </div>
        <div className="text-center">
          <a
            href={'https://www.npmjs.com/package/' + this.props.name}
            className="btn btn-dark d-inline-flex align-items-center"
          >
            <GoBook className="mr-1" size="1.3em" />
            Read documentation
          </a>
        </div>
      </div>
    );
  }
}
