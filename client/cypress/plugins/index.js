const wp = require('cypress-webpack-preprocessor-v5')
const PnpWebpackPlugin = require('pnp-webpack-plugin')

module.exports = (on) => {
  const options = {
    webpackOptions: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: [/node_modules/],
            use: 'babel-loader',
          },
        ],
      },
      resolve: {
        plugins: [PnpWebpackPlugin],
      },
      resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
      },
    },
    watchOptions: {},
  }
  on('file:preprocessor', wp(options))
}
