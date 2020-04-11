const CreateUserRepository = require('./create-user-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
let db

const createSut = () => {
  return new CreateUserRepository()
}

describe('Create User Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await db.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return Error when email is empty', () => {
    const sut = createSut()
    const promise = sut.createUser()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should return Error when password is empty', () => {
    const sut = createSut()
    const promise = sut.createUser('email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should return user when user are created', async () => {
    const sut = createSut()
    const user = await sut.createUser('email@email.com', 'any_password')
    expect(user.email).toBe('email@email.com')
    expect(user.password).toBe('any_password')
  })
})
