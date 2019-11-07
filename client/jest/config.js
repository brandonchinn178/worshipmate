// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '..'),
  roots: ['<rootDir>/lib', '<rootDir>/pages'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  testRegex: 'test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/lib/$1',
    '^~jest-utils$': '<rootDir>/jest/utils',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
}
