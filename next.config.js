const path = require("path");

module.exports = {
  webpack(config, _) {
    config.resolve.alias["@components"] = path.join(__dirname, "components");
    return config;
  }
};
