const path = require('path')

module.exports = {
  stories: ['../lib/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: (config) => {
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
  },
}
