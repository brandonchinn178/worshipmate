module.exports = {
  presets: [require.resolve('next/babel')],
  plugins: [
    [require.resolve('babel-plugin-styled-components'), { ssr: true }],
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
  ],
}
