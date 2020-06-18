module.exports = function (wallaby) {
  return {
    // runAllTestsInAffectedTestFile: true,
    files: [
      'src/**/*',
      'jest.config.js',
      'package.json',
      'tsconfig.json',
      { pattern: "env.yml", instrument: false },
      { pattern: "test/jest.setup.js", instrument: false },
      { pattern: "test/testing/test-console.ts", instrument: false },
      { pattern: "test/data/**/*.ts", instrument: true },
      { pattern: "test/models/*", instrument: true },
      { pattern: "test/store/**/*.ts", instrument: true },
      { pattern: "test/helpers/*", instrument: true },
      // { pattern: "node_modules/fake-indexeddb/**/*.js", instrument: true },
      // { pattern: "node_modules/firemodel/**/*.js", instrument: true },
    ],

    tests: ["test/**/*-spec.ts"],

    // compilers: {
    //   'node_modules/firemodel/**/*.js': wallaby.compilers.babel({}),
    // },

    env: {
      type: "node",
      runner: "node"
    },

    // preprocessors: {
    //   '**/*.js?(x)': file =>
    //     require('@babel/core').transform(file.content, {
    //       sourceMap: true,
    //       compact: false,
    //       filename: file.path,
    //       plugins: ['babel-plugin-jest-hoist'],
    //     }),
    // },

    setup: function (wallaby) {
      // const jestConfig = require('./package').jest || require('./jest.config')
      // delete jestConfig.transform['^.+\\.tsx?$']
      // wallaby.testFramework.configure(jestConfig)

      if (!console._restored) {
        console.log('console.log stream returned to normal for test purposes')
        console.log = function () {
          return require('console').Console.prototype.log.apply(this, arguments)
        }
        console.error = function () {
          return require('console').Console.prototype.error.apply(this, arguments)
        }
        console._restored = true
      }
    },

    testFramework: "jest",
    debug: true
  };
};
