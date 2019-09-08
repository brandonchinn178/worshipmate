/* eslint-disable */

const path = require("path");

module.exports = {
  webpack(config, _) {
    config.resolve.alias["~"] = path.join(__dirname, "lib");
    return config;
  },

  experimental: {
    publicDirectory: true,
  },
};
