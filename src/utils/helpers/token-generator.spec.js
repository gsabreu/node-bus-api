jest.mock('jsonwebtoken', () => ({
  token: 'any_token',

  sign (payload, secret) {
    this.payload = payload
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')
const TokenGenerator = require('./token-generator')

const createSut = () => {
  return new TokenGenerator('secret')
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

  test('Should call jwt with correct values', async () => {
    const sut = createSut()
    await sut.generate('any_id')
    expect(jwt.payload).toEqual({ _id: 'any_id' })
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if  secret isnt provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
  test('Should throw if id isnt provided', async () => {
    const sut = createSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
