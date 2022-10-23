module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "linebreak-style": 0,
    "max-len": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": "warn",
    camelcase: "off",
  },
};
