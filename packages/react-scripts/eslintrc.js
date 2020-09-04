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
  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "error",
  },
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
}