import * as React from 'react';
import { GoMarkGithub, GoBook } from 'react-icons/go';
import Generator from './teaser/generator';
import Link from '@docusaurus/Link';

export default function Teaser() {
  let [stats, setStats] = React.useState<
    | {
        stars: number;
      }
    | undefined
  >();

  React.useEffect(() => {
    (async () => {
      if (window && window.fetch) {
        const response = await fetch(`https://avatars.dicebear.com/stats.json`);

        const json = await response.json();

        setStats(json.data);
      }
    })();
  }, []);

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
                      <img src={'img/logo.svg'} alt="DiceBear Avatars" className="logo mb-5" />
                      <p className="text-white lead">
                        DiceBear is an avatar library for designers and developers. You can choose between simple
                        identicons and lovely designed characters.
                      </p>
                      <p className="text-white lead mb-5">
                        And best of all: We provide a simple and free HTTP API that you can use right away!
                      </p>
                      <div className="mb-lg-4 d-flex justify-content-center justify-content-lg-start">
                        <div>
                          <Link
                            to="/docs"
                            className="btn btn-light d-inline-flex align-items-center mr-sm-4 mb-2 mb-sm-0"
                          >
                            <GoBook className="mr-1" size={20} />
                            Documentation
                          </Link>
                          <br className="d-sm-none" />
                          <Link
                            className="btn btn-light d-inline-flex align-items-center"
                            href={`https://github.com/DiceBear/avatars${stats ? '/stargazers' : ''}`}
                          >
                            <GoMarkGithub className="mr-1" size={20} />
                            {stats ? 'Star' : 'GitHub'}
                          </Link>
                          {stats && (
                            <Link
                              className="btn btn-tooltip"
                              href="https://github.com/DiceBear/avatars/stargazers"
                              target="_blank"
                            >
                              {stats.stars}
                            </Link>
                          )}

                          <div className="d-flex flex-column align-items-center mt-5">
                            <div className="text-white line-height-0 mb-1">sponsored by</div>
                            <Link className="btn btn-block btn-light justify-center p-3" href="https://bunny.net/">
                              <img src="/img/bunnycdn.svg" alt="bunnycdn" style={{ maxWidth: 200, height: 'auto' }} />
                            </Link>
                          </div>
                        </div>
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
                  <Generator />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
