module.exports = {
  target: 'webworker',
  mode: 'production',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      jdenticon: require.resolve('jdenticon/src/node'),
    },
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  optimization: {
    minimize: false,
  },
};
