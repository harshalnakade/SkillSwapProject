module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // This is the most important setting
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};