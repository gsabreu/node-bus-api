const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')
let userModel

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should retrn 400 when user alredy exists', async () => {
    await userModel.insertOne({
      email: 'valid_email@mail.com'
    })

    await request(app)
      .post('/api/user')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(400)
  })

  test('Should retrn 200 valid params are provided', async () => {
    await request(app)
      .post('/api/user')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_passwordd'
      })
      .expect(200)
  })
})
