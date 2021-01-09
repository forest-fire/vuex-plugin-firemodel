module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "@vue/typescript/recommended",
    "plugin:promise/recommended",
    "prettier/vue",
    "prettier/@typescript-eslint",
    "prettier"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // prefer to be able to be implicit sometimes
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // allow `index.ts` files to aggregate exports
    "import/export": "off",
    // always prefer named exports
    "import/prefer-default-export": "off",
    // when you're running in parallel and waiting on Promise.all() this is problematic
    "promise/always-return": "off",
    // not helpful when destructuring an array
    "@typescript-eslint/no-unused-vars": "off",
    // Had to add to get this Vue2 project working
    "vue/no-deprecated-functional-template": "off",
    "vue/no-deprecated-filter": "off",
    "vue/valid-v-slot": "off",

    // These were errors but making warning for now; need to review
    "vue/no-v-html": ["warn"],
    "promise/catch-or-return": ["warn"],
    "vue/no-deprecated-slot-scope-attribute": ["warn"],
    "vue/no-deprecated-dollar-listeners-api": ["warn"],
    "vue/no-deprecated-v-on-native-modifier": ["warn"],
    "@typescript-eslint/no-shadow": ["warn"],

    // note you must disable the base rule as it can report incorrect errors
    "no-shadow": "off"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
