/**
 * Jest Configuration
 */

export default {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "features/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
