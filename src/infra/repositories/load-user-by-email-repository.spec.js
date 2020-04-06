const { MongoClient } = require('mongodb')
class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

let client, db

const createSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { userModel, sut }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  test('Should return null if no user is found ', async () => {
    const { sut } = createSut()
    const user = await sut.load('invalid_email@gmail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found ', async () => {
    const { sut, userModel } = createSut()
    await userModel.insertOne({
      email: 'valid_email@gmail.com'
    })
    const user = await sut.load('valid_email@gmail.com')
    expect(user.email).toBe('valid_email@gmail.com')
  })
})
