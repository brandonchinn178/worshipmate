const path = require('path')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [require.resolve('babel-preset-react-app')]
        },
      },
    ],
  })

  config.resolve.alias['~'] = path.join(__dirname, '..', 'lib')
  config.resolve.extensions.push('.ts', '.tsx')

  return config
}
