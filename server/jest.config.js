/* eslint-disable no-process-env */

const jest = require('ts-jest/utils')

const tsconfig = require('./tsconfig')

const isUnit = process.env.TEST_TYPE === 'unit'
const isE2E = process.env.TEST_TYPE === 'e2e'
const compact = (a) => a.filter(Boolean)

module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testMatch: compact([isUnit && '**/*.spec.ts', isE2E && '**/*.e2e-spec.ts']),
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/__test__/',
    '/migrations/',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    ...jest.pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}
