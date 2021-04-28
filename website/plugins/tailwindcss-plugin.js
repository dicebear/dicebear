module.exports = function (context, options) {
  return {
    name: 'tailwindcss-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(
        require('postcss-import'),
        require('tailwindcss'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 4,
        })
      );

      return postcssOptions;
    },
  };
};
