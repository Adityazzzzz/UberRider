/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@usecase/(.*)$": "<rootDir>/src/usecase/$1",
    "^@repository/(.*)$": "<rootDir>/src/repository/$1",
    "^@delivery/(.*)$": "<rootDir>/src/delivery/$1"
  }
};