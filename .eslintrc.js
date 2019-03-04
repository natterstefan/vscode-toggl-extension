module.exports = {
  extends: 'eslint-config-ns',
  env: {
    node: true,
  },
  rules: {
    'class-methods-use-this': 0,
    'jest/consistent-test-it': [
      'error',
      {
        fn: 'it',
        withinDescribe: 'it',
      },
    ],
    'jest/prefer-strict-equal': 'error',
    'no-console': 0,
    'sort-keys': 0,
  },
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-console': 0,
      },
    },
  ],
}
