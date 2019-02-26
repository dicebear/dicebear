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
        <div className="container teaser-container-desktop">
          <div className="row">
            <div className="col-12 col-lg-6 teaser-brand py-5 py-lg-0">
              <div className="container teaser-container-mobile">
                <div className="row">
                  <div className="col-12 offset-md-2 col-md-8 offset-lg-0 col-lg-11 offset-xl-1 col-xl-10">
                    <div className="min-vh-lg-100 d-flex align-items-center">
                      <div className="text-center text-lg-left">
                        <img src="/static/img/logo.svg" alt="DiceBear Avatars" className="logo mb-5" />
                        <p className="text-white lead">
                          Avatars is an avatar placeholder library for designers and developers. You can choose between
                          simple identicons and lovely designed characters.
                        </p>
                        <p className="text-white lead mb-5">
                          And best of all: We provide a simple and free HTTP API that you can use right away!
                        </p>
                        <div className="mb-lg-4">
                          <a
                            href="#introductions"
                            className="btn btn-light d-inline-flex align-items-center mr-sm-4 mb-2 mb-sm-0"
                            onClick={e => this.onClickScrollTo(e)}
                          >
                            <GoBook className="mr-1" size={20} />
                            Documentation
                          </a>
                          <br className="d-sm-none" />
                          <a
                            className="btn btn-light d-inline-flex align-items-center"
                            href={this.props.meta.stargazers.url}
                          >
                            <GoMarkGithub className="mr-1" size={20} />
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
              </div>
            </div>
            <div className="col-12 col-lg-6 teaser-generator py-4 py-lg-0">
              <div className="container teaser-container-mobile">
                <div className="row">
                  <div className="col-12 offset-md-2 col-md-8 offset-lg-1 col-lg-11 col-xl-10">
                    <Generator meta={this.props.meta} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
