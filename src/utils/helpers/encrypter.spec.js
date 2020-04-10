jest.mock('bcrypt', () => ({
  isValid: true,

  async compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}))

const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')
const MissingParamError = require('../errors/missing-param-error')

const createSut = () => {
  return new Encrypter()
}
describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = createSut()
    const isValid = await sut.compare('any_value', 'hashedValue')
    expect(isValid).toBe(true)
  })

  test('Should return false if bcrypt returns false', async () => {
    const sut = createSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashedValue')
    expect(isValid).toBe(false)
  })

  test('Should call decrypt if correct values', async () => {
    const sut = createSut()
    await sut.compare('any_value', 'hashedValue')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashedValue')
  })

  test('Should thorw if arent provide params', async () => {
    const sut = createSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
