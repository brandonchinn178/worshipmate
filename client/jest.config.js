module.exports = {
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
