/* eslint-disable */

const path = require("path");

module.exports = {
  webpack(config, _) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.alias["~"] = path.join(__dirname, "lib");

    return config;
  },

  experimental: {
    publicDirectory: true,
  },
};
