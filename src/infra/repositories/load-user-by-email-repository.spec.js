const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let db

const createSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { userModel, sut }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.close
  })

  test('Should return null if no user is found ', async () => {
    const { sut } = createSut()
    const user = await sut.load('invalid_email@gmail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found ', async () => {
    const { sut, userModel } = createSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@gmail.com',
      name: 'any_name',
      age: 50,
      state: 'any_status',
      password: 'hashed_password'
    })
    const user = await sut.load('valid_email@gmail.com')
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('Should throw if userModel isnt provided ', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('any_email@gmail.com')
    expect(promise).rejects.toThrow()
  })
})
