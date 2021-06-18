module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
  ],
  rules: {
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'error',
    // https://github.com/vercel/next.js/issues/26330
    '@next/next/no-html-link-for-pages': ['error', 'client/pages'],
  },
  globals: {
    React: 'writable',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['_document.tsx'],
      rules: {
        // https://github.com/vercel/next.js/issues/26160
        '@next/next/no-page-custom-font': 'off',
      },
    },
  ],
}
