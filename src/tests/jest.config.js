/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  globalSetup: './setup.ts',
  globalTeardown: './teardown.ts',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }]
  },
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/", 
    "<rootDir>/.next/"
  ],
  verbose: true
}; 