const wp = require('cypress-webpack-preprocessor-v5')

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
    },
    watchOptions: {},
  }
  on('file:preprocessor', wp(options))
}
