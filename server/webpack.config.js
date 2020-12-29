const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { WebpackPnpExternals } = require('webpack-pnp-externals')

module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  externals: [WebpackPnpExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      PnpWebpackPlugin,
      new TsconfigPathsPlugin({ configFile: './tsconfig.build.json' }),
    ],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()],
}
