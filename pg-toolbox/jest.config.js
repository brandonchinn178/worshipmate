const jest = require('ts-jest/utils')

const tsconfig = require('./tsconfig')

const unitTests = '**/*.spec.ts'
const e2eTests = '**/*.e2e-spec.ts'

const isUnit = process.env.TEST_TYPE === 'unit'
const isE2E = process.env.TEST_TYPE === 'e2e'
const compact = (a) => a.filter(Boolean)

module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testMatch: compact([isUnit && unitTests, isE2E && e2eTests]),
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/__test__/'],
  testEnvironment: 'node',
  moduleNameMapper: {
    ...jest.pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
}
