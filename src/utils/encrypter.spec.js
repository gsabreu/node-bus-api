const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

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
})
