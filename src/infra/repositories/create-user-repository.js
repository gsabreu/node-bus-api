const MongoHelper = require('../helpers/mongo-helper')
const LoginValidator = require('../../utils/helpers/login-validator')

module.exports = class CreateUserRepository {
  async createUser (email, password) {
    LoginValidator.validateParams(email, password)

    const userModel = await MongoHelper.getCollection('users')
    var user = null
    await userModel.insertOne({
      email: email,
      password: password
    })
      .then(result => {
        user = result.ops[0]
      })
    return user
  }
}
