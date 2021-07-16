const jest = require('ts-jest/utils')

const tsconfig = require('./tsconfig')

module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/lib', '<rootDir>/pages'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    ...jest.pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '\\.svg$': '<rootDir>/jest/svgMock',
    'react-select': '<rootDir>/jest/reactSelectMock',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.tsx'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}
