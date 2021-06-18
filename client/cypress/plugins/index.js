const wp = require('cypress-webpack-preprocessor-v5')

module.exports = (on) => {
  const options = wp.defaultOptions
  delete options.webpackOptions.module.rules[0].use[0].options.presets

  on('file:preprocessor', wp(options))
}
