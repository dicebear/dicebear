import * as React from 'react';

import { Meta } from '../types/meta';
import SpriteCollection from './spriteCollections/spriteCollection';
import { PublicConfigSpriteCollection } from '../types/publicConfig';

type Props = {
  meta: Meta;
  avatars: PublicConfigSpriteCollection[];
};

export default class SpriteCollections extends React.Component<Props> {
  render() {
    return (
      <div id="sprite-collections" className="min-vh-100 py-5 bg-light">
        <div className="container">
          <h2 className="display-1 text-center">Sprite Collections</h2>
          <p className="mb-6 text-center lead">
            Do you want to create male, female or abstract avatars?
            <br />
            You have the choice between several lovely designed sprite collections.
          </p>
          <div className="row">
            {this.props.meta.spriteCollections.map((spriteCollection, key) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={key}>
                <SpriteCollection {...spriteCollection} />
              </div>
            ))}
            <div className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between">
                <div className="text-center">
                  <h4 className="h5 mb-4">Your sprite collection here?</h4>
                  <p>
                    You are a designer or developer and would like to contribute with a self-designed sprite collection?
                  </p>
                  <p>Create an issue so that we can add your work to the list.</p>
                </div>
                <a href={this.props.meta.issues.url} className="btn btn-outline-dark mx-5">
                  Create issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
