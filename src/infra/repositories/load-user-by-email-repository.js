const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne(
      { email }, {
        projection: {
          password: 1
        }
      })
    if (!email) {
      throw new MissingParamError('email')
    }
    return user
  }
}
