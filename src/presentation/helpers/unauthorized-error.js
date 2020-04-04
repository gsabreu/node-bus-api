module.exports = class UnauthorizedError extends Error {
  constructor () {
    super('User is not Authorized')
    this.name = 'UnauthorizedError'
  }
}
