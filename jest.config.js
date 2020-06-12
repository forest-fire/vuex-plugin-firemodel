const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  transform: {
    ...tsjPreset.transform,
		'^.+\\.[jt]sx?$': 'jest-esm-transformer',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!firemodel).+\\.js$',
    '/node_modules/(?!universal-fire).+\\.js$',
  ],
  moduleNameMapper: {
    '^firemodel$': '<rootDir>/node_modules/firemodel/dist/es/index.js',
    '^universal-fire$': '<rootDir>/node_modules/universal-fire/dist/es/index.js',
  },
  testEnvironment: 'node',
};