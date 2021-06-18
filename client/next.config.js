/* eslint-disable */

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const path = require('path')

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { dev, isServer }) {
    if (dev && isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin())
    }

    return config
  },
}
