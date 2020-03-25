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
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
}
