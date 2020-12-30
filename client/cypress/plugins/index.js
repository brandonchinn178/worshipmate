const wp = require('cypress-webpack-preprocessor-v5')
const { spawnSync } = require('child_process')
const path = require('path')
const PnpWebpackPlugin = require('pnp-webpack-plugin')

const TOP = path.resolve(process.cwd(), '..')

const yarn = (...args) => {
  const { error } = spawnSync('yarn', args, {
    cwd: TOP,
  })

  if (error) {
    throw error
  }
}

module.exports = (on) => {
  process.env.NODE_ENV = 'test'

  const options = {
    webpackOptions: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: [/node_modules/],
            use: 'babel-loader',
          },
        ],
      },
      resolve: {
        plugins: [PnpWebpackPlugin],
      },
      resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
      },
    },
    watchOptions: {},
  }
  on('file:preprocessor', wp(options))

  on('task', {
    clearDatabase() {
      yarn('server', 'db:clear')
      return null
    },
    seedDatabase() {
      yarn('server', 'db:init')
      return null
    },
  })
}
