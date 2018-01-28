const licenseChecker = require('license-checker');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

module.exports = async () => {
  let licenseInformations = await new Promise((resolve, reject) => {
    licenseChecker.init(
      {
        start: __dirname,
        production: true
      },
      function(err, json) {
        err ? reject(err) : resolve(json);
      }
    );
  });

  let licenses = [];

  Object.keys(licenseInformations).forEach(name => {
    let license = licenseInformations[name];

    licenses.push(
      [
        name + ':',
        '  author: ' + license.publisher,
        '  license: ' + license.licences,
        '  repository: ' + license.repository
      ].join('\n')
    );
  });

  let banner = licenses.join('\n\n');

  let baseConfig = {
    entry: './lib/index.js',
    devtool: 'sourcemap',
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'avatars.js',
      library: 'Avatars',
      libraryTarget: 'umd',
      libraryExport: 'default',
      umdNamedDefine: true
    },
    plugins: [new webpack.BannerPlugin(banner)]
  };

  let minifyConfig = merge({}, baseConfig, {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ],
    output: {
      filename: 'avatars.min.js'
    }
  });

  return [baseConfig, minifyConfig];
};
