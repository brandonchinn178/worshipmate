// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const roots = process.env.STORYSHOTS_DIR
  ? ['<rootDir>/stories/']
  : ['<rootDir>/lib', '<rootDir>/pages']

module.exports = {
  rootDir: path.join(__dirname, '..'),
  roots,
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  testRegex: 'test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/lib/$1',
    '^~jest-utils$': '<rootDir>/jest/utils',
    '^~stories$': '<rootDir>/stories',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
}
