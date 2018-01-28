const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

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
  }
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

module.exports = [baseConfig, minifyConfig];
