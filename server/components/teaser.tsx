import * as React from 'react';
import { GoMarkGithub, GoBook } from 'react-icons/go';
import { Meta } from '../types/meta';
import Generator from './teaser/generator';

type Props = {
  meta: Meta;
};

export default class Teaser extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  onClickScrollTo(e: React.MouseEvent<HTMLAnchorElement>) {
    document.querySelector(e.currentTarget.getAttribute('href')).scrollIntoView({ block: 'start', behavior: 'smooth' });

    e.preventDefault();
  }

  render() {
    return (
      <div className="teaser gradient-blue">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <div className="offset-1 col-10">
                <div className="min-vh-100 d-flex align-items-center">
                  <div>
                    <img src="/static/img/logo.svg" alt="DiceBear Avatars" className="logo mb-5" />
                    <p className="text-white lead">
                      Avatars lets you create avatar placeholders. You can choose between simple identicons and lovely
                      designed characters.
                    </p>
                    <p className="text-white lead mb-5">
                      And best of all: We provide a simple and free HTTP API that you can use right away!
                    </p>
                    <div className="mb-4">
                      <a
                        href="#introductions"
                        className="btn btn-light d-inline-flex align-items-center mr-4"
                        onClick={e => this.onClickScrollTo(e)}
                      >
                        <GoBook className="mr-1" size="1.3em" />
                        Documentation
                      </a>
                      <a
                        className="btn btn-light d-inline-flex align-items-center"
                        href={this.props.meta.stargazers.url}
                      >
                        <GoMarkGithub className="mr-1" size="1.3em" />
                        Star
                      </a>
                      <a className="btn btn-tooltip" href={this.props.meta.stargazers.url} target="_blank">
                        {this.props.meta.stargazers.count}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="offset-1 col-10">
                <Generator meta={this.props.meta} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
