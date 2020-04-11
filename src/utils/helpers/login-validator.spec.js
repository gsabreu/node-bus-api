const { MissingParamError } = require('../errors')
const LoginValidator = require('./login-validator')

describe('Login Validator', () => {
  test('Should return missing param error with email is empty', () => {
    expect(() => LoginValidator.validateParams(null, 'any_pass')).toThrowError(new MissingParamError('email'))
  })

  test('Should return missing param error with password is empty', () => {
    expect(() => LoginValidator.validateParams('any_email', null)).toThrowError(new MissingParamError('password'))
  })

  test('Should return missing param error with all params are null', () => {
    expect(() => LoginValidator.validateParams()).toThrowError(new MissingParamError('email'))
  })
})
