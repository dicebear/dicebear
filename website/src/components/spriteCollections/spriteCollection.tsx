import * as React from 'react';

import { GoBook } from 'react-icons/go';

import SpriteCollectionType from '../../types/spriteCollection';
import Link from '@docusaurus/Link';

type Props = SpriteCollectionType;

export default class SpriteCollection extends React.Component<Props> {
  render() {
    return (
      <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between shadow position-relative">
        <div>
          <div className="row pb-2">
            <div className="offset-3 col-6">
              <img src={`https://avatars.dicebear.com/api/${this.props.id}/seed.svg`} alt={this.props.id} />
            </div>
          </div>
          <h3 className="display-3 text-center mb-0">{this.props.id}</h3>
          <p className="text-muted text-center mb-5">@dicebear/avatars-{this.props.id}-sprites</p>
        </div>
        <div className="text-center">
          <Link
            to={`/styles/${this.props.id}`}
            className="btn btn-dark d-inline-flex align-items-center stretched-link"
          >
            <GoBook className="mr-1" size={20} />
            Read documentation
          </Link>
        </div>
      </div>
    );
  }
}
