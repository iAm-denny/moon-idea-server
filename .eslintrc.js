module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': 0,
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    camelcase: 'off',
  },
};
