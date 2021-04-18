import * as React from 'react';
// @ts-ignore
import Layout from '@theme/Layout';
import styles from '../options';
import Link from '@docusaurus/Link';

export default () => (
  <Layout>
    <div className="container padding-vert--lg">
      <h1>Licenses</h1>

      <p className="mb-5">
        While our code is MIT licensed, the designs are licensed under different licenses that the designers can choose
        themselves. Some licenses require attribution. You must respect both licenses if you want to use avatars from
        DiceBear.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Designer</th>
            <th>Source</th>
            <th>License</th>
          </tr>
        </thead>
        <tbody>
          {styles.map((val) => {
            return (
              <tr>
                <td>
                  <Link to={`/styles/${val.id}`}>{val.id}</Link>
                </td>
                <td>{val.style.meta.title}</td>
                <td>{val.style.meta.creator}</td>
                <td>
                  <a href={val.style.meta.source} target="_blank">
                    {val.style.meta.source}
                  </a>
                </td>
                <td>
                  <a href={val.style.meta.license.url} target="_blank">
                    {val.style.meta.license.name}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Layout>
);
