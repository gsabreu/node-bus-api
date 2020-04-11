const { MissingParamError } = require('../errors')

module.exports = class LoginValidator {
  static validateParams (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}
