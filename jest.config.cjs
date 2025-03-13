module.exports = {
  transform: {
    '^.+\\.(ts|js)$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}; 