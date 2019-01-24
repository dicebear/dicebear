import * as React from 'react';
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/prism-light';
import js from 'react-syntax-highlighter/dist/languages/prism/javascript';
import prism from 'react-syntax-highlighter/dist/styles/prism/prism';

import { Meta, MetaSpriteCollection } from '../types/meta';

registerLanguage('javascript', js);

type Props = {
  meta: Meta;
};

export default class Introductions extends React.Component<Props> {
  getHttpApiDescription() {
    let spriteCollections = this.props.meta.spriteCollections.map((spriteCollection, index, array) => {
      // Is penultimate entry
      if (index === array.length - 1) {
        return (
          <React.Fragment key={index}>
            <code>{spriteCollection.id}</code>
          </React.Fragment>
        );
      }

      // Is last entry
      if (index === array.length - 2) {
        return (
          <React.Fragment key={index}>
            <code>{spriteCollection.id}</code>
            {' or '}
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={index}>
          <code>{spriteCollection.id}</code>
          {', '}
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        Replace <code>:sprites</code> with {spriteCollections}. The value of <code>:seed</code> can be anything you like
        - but <strong>don't</strong> use any sensitive or personal data here!
      </React.Fragment>
    );
  }

  getPackageCDN() {
    return `https://unpkg.com/${this.props.meta.name}@${this.props.meta.version}/dist/avatars.min.js`;
  }

  getSpriteCollectionCDN(spriteCollection: MetaSpriteCollection) {
    return `https://unpkg.com/${spriteCollection.name}@${spriteCollection.version}/dist/sprites.min.js`;
  }

  render() {
    return (
      <div id="introductions" className="min-vh-100 pt-5 pb-6">
        <div className="container">
          <h2 className="display-1 text-center">How to use</h2>
          <p className="mb-6 text-center lead">
            You can start directly with our free HTTP-API or alternatively use the JavaScript library.
          </p>

          <div className="row mb-5">
            <div className="col-12 offset-xl-1 col-xl-10">
              <h4 className="text-muted text-center">HTTP-API</h4>
              <div className="rounded bg-light p-3">
                <p>Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.</p>
                <SyntaxHighlighter className="bg-white border rounded" style={prism}>
                  {'https://avatars.dicebear.com/v3/:sprites/:seed.svg'}
                </SyntaxHighlighter>
                <p>{this.getHttpApiDescription()}</p>
                <hr />
                <p className="mb-0">
                  The used sprite collection may offer additional options, which can be set using the GET parameter
                  named <code>options</code>. For example, to create a happy{' '}
                  <i>{this.props.meta.spriteCollections[0].id}</i> avatar with the seed <code>john</code>, the following
                  URL can be used:
                </p>
                <SyntaxHighlighter className="bg-white border rounded" style={prism}>
                  {`https://avatars.dicebear.com/v3/${
                    this.props.meta.spriteCollections[0].id
                  }/john.svg?options[mood][]=happy`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 offset-xl-1 col-xl-10">
              <h4 className="text-muted text-center">NPM</h4>
              <div className="rounded bg-light p-3">
                <p className="mb-4">
                  Choose NPM if you want to use a spriteCollection that is not available via the HTTP-API.
                </p>

                <p>Install the Avatars package with the following command.</p>
                <SyntaxHighlighter className="mb-4 bg-white border rounded" style={prism}>
                  {`$ npm install --save ${this.props.meta.name}`}
                </SyntaxHighlighter>

                <p>
                  You also need to add a sprite collection. In our example, we will use the{' '}
                  {this.props.meta.spriteCollections[0].id} sprite collection.
                </p>
                <SyntaxHighlighter className="mb-4 bg-white border rounded" style={prism}>
                  {`$ npm install --save ${this.props.meta.spriteCollections[0].name}`}
                </SyntaxHighlighter>

                <p>Now you are ready to create your first Avatar.</p>
                <SyntaxHighlighter
                  className="mb-3 bg-white border rounded"
                  language="javascript"
                  style={prism}
                >{`import Avatars from '${this.props.meta.name}';
import sprites from '${this.props.meta.spriteCollections[0].name}';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');`}</SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
