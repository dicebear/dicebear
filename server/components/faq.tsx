import * as React from 'react';

export default class Faq extends React.Component {
  render() {
    return (
      <div id="faq" className="py-5">
        <div className="container">
          <h2 className="display-1 text-center mb-6">Frequently Asked Questions</h2>

          <div className="row">
            <div className="col-12 col-md-6 mb-5">
              <h4 className="h5">What is this library best suited for?</h4>
              <p>
                DiceBear Avatars is best suited for designers and developers to create avatar placeholders. But you are
                free to use the generated avatars for other purposes.
              </p>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <h4 className="h5">Does a seed always return the same avatar?</h4>
              <p>
                Yes, as long as the same version of a sprite collection is used, a seed will always return the same
                avatar. This allows you to represent user identities with DiceBear Avatars, for example.
              </p>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <h4 className="h5">Will the library remain free of charge?</h4>
              <p>
                DiceBear Avatars is developed open source and will remain free of charge. I believe that everyone should
                be able to benefit from this library. Also I'm always happy about improvements and extensions of
                contributors, which help me to make DiceBear Avatars even better.
              </p>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <h4 className="h5">Can I use an email address or other sensitive or personal information as a seed?</h4>
              <p>
                No! Sensitive or personal data should never be used as seed. The seed could be read from the source
                code. The generated avatar could also reveal the seed.
              </p>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <h4 className="h5">Where are the servers located?</h4>
              <p>The HTTP API replies from servers in Frankfurt (Germany), Oregon (USA) and Singapore.</p>
            </div>
            <div className="col-12 col-md-6 mb-5">
              <h4 className="h5">How stable is the HTTP API?</h4>
              <p>
                DiceBear Avatars is a hobby project. Therefore, I can not guarantee the availability of the HTTP API.
                Access to the HTTP-API can be temporarily or permanently blocked. I also reserve the right to completely
                discontinue the HTTP API.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
