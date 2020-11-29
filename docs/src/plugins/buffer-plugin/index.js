const webpack = require("webpack");

module.exports = function (context, options) {
  return {
    name: "buffer-plugin",
    configureWebpack(config, isServer, utils) {
      if (isServer) {
        return {
          node: {
            //Buffer: true,
          },
          plugins: [
            new webpack.ProvidePlugin({
              Buffer: ["buffer", "Buffer"],
              btoa: ["btoa"],
            }),
          ],
        };
      }

      return {};
    },
  };
};
