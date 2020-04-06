const EmailValidator = require('./email-validator')
const validator = require('validator')
const MissingParamError = require('../errors/missing-param-error')

const createSut = () => {
  return new EmailValidator()
}
describe('Email Validator', () => {
  test('Should return true if validator returns true ', () => {
    const sut = createSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false ', () => {
    validator.isEmailValid = false
    const sut = createSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validatir w/ correct email ', () => {
    const sut = createSut()
    sut.isValid('any_email@mail.com')
    expect(validator.email).toBe('any_email@mail.com')
  })

  test('Should thorw if email arent provide', async () => {
    const sut = createSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})
