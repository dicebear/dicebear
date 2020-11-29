import * as React from "react";

import SpriteCollection from "./spriteCollections/spriteCollection";
import spriteCollections from "../options";
import Link from "@docusaurus/Link";

export default class SpriteCollections extends React.Component {
  render() {
    return (
      <div className="row mt-5">
        {(spriteCollections || []).map((spriteCollection, key) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={key}>
            <SpriteCollection {...spriteCollection} />
          </div>
        ))}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between shadow">
            <div className="text-center">
              <h4 className="h5 mb-4">Your sprite collection here?</h4>
              <p>
                You are a designer or developer and would like to contribute
                with a self-designed sprite collection?
              </p>
              <p>Create an issue so that we can add your work to the list.</p>
            </div>
            <div className="text-center">
              <Link
                href="https://github.com/DiceBear/avatars/issues"
                className="btn btn-outline-dark mx-5"
              >
                Create issue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
