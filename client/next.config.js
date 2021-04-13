/* eslint-disable */

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const path = require('path')

module.exports = {
  webpack(config, { dev, isServer }) {
    config.resolve.alias['~'] = path.join(__dirname, 'lib')

    if (dev && isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin())
    }

    return config
  },
}
