module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['styled-components', { ssr: true }],
    '@babel/proposal-nullish-coalescing-operator',
    '@babel/proposal-optional-chaining',
  ],
}
