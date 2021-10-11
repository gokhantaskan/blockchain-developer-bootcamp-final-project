module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "@vue/standard",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "arrow-parens": [1, "as-needed"],
    "comma-dangle": [1, { arrays: "always-multiline", objects: "always-multiline", imports: "never", exports: "never", functions: "never" }],
    "max-len": [0, { code: 80, ignoreComments: false, ignoreStrings: false }],
    "no-console": 1,
    "no-debugger": 1,
    "no-useless-return": 0,
    "space-before-function-paren": [1, { anonymous: "never", named: "never", asyncArrow: "always" }],
    "vue/html-indent": [1, 2, { attribute: 1, baseIndent: 1, closeBracket: 0, alignAttributesVertically: false, ignores: [] }],
    indent: 1,
    quotes: [1, "double", "avoid-escape"],
    semi: [1, "always", { omitLastInOneLineBlock: true }],
  },
};
