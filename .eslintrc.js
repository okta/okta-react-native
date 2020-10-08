// https://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:node/recommended-script',
    'plugin:jest/recommended'
  ],
  plugins: [
    'node',
    'jest'
  ],
  rules: {
    'semi': ['error', 'always'],
  },
  overrides: [
    {
      // ES6 processed by Babel
      files: [
        'index.js',
        'index.test.js'
      ],
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      env: {
        es6: true,
        node: false
      },
      rules: {
        'node/no-unsupported-features/es-syntax': 0,
        'node/no-unsupported-features/node-builtins': 0
      }
    },
    {
      // Jest specs
      files: ['index.test.js'],
      env: {
        jest: true
      }
    }
  ]
};
