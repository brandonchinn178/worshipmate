const path = require('path')

module.exports = {
  stories: ['../lib/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.module.rules = [
      {
        test: /\.(ts|tsx)$/,
        use: [require.resolve('babel-loader')],
      },
    ]

    config.resolve.alias['~'] = path.join(__dirname, '..', 'lib')
    config.resolve.extensions.push('.ts', '.tsx')

    return config
  },
}
