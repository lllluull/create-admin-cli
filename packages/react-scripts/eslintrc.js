module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    "prettier",
    "prettier/standard",
    "prettier/react",
    "plugin:react/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  parser: "babel-eslint",
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
}