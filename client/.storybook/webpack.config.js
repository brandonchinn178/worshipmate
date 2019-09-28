const path = require('path')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
      },
    ],
  })

  config.resolve.alias['~'] = path.join(__dirname, '..', 'lib')
  config.resolve.alias['~stories'] = path.join(__dirname, '..', 'stories')
  config.resolve.extensions.push('.ts', '.tsx')

  return config
}
