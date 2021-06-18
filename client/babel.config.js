const { extendDefaultPlugins } = require('svgo')

module.exports = {
  presets: [require.resolve('next/babel')],
  plugins: [
    [require.resolve('babel-plugin-styled-components'), { ssr: true }],
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    [
      require.resolve('babel-plugin-inline-react-svg'),
      {
        svgo: {
          plugins: extendDefaultPlugins([
            {
              name: 'removeViewBox',
              active: false,
            },
            { name: 'removeDimensions' },
          ]),
        },
      },
    ],
  ],
}
