const jwt = require('jsonwebtoken')
const TokenGenerator = require('./token-generator')

const createSut = () => {
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = createSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return token if JWT returns token', async () => {
    const sut = createSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })
})
