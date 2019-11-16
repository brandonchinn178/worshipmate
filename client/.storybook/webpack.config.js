// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = ({ config }) => {
  config.module.rules = [
    {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'babel-loader',
        },
      ],
    },
    {
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    },
  ]

  config.resolve.alias['~'] = path.join(__dirname, '..', 'lib')
  config.resolve.alias['~stories'] = path.join(__dirname, '..', 'stories')
  config.resolve.extensions.push('.ts', '.tsx')

  return config
}
