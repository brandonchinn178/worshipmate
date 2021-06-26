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
    '\\.svg$': '<rootDir>/jest/svgMock',
    'react-select': '<rootDir>/jest/reactSelectMock',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.tsx'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}
