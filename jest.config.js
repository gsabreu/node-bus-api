module.exports = {
  coverageDirectory: 'coverage',
  testEnviroment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**.js'],
  preset: '@shelf/jest-mongodb'
}
