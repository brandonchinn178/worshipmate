const jest = require('ts-jest/utils')

const tsconfig = require('./tsconfig')

const unitTests = '**/*.spec.ts'
const integrationTests = '**/*.test.ts'
const e2eTests = '**/*.e2e-spec.ts'

let testMatch
switch (process.env.TEST_TYPE) {
  case 'unit':
    testMatch = [unitTests]
    break
  case 'integration':
    testMatch = [integrationTests]
    break
  case 'e2e':
    testMatch = [e2eTests]
    break
  default:
    testMatch = [unitTests, integrationTests, e2eTests]
}

module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testMatch,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/ormconfig\\.js',
    '<rootDir>/migration/',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.ts'],
  moduleNameMapper: {
    ...jest.pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
}
