module.exports = {
  displayName: {
    name: 'Core',
    color: 'white',
  },
  collectCoverageFrom: ['**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
