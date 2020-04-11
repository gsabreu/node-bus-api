const UserAlredyExists = require('../errors/user-alredy-exists-error')
const LoginValidator = require('../../../utils/helpers/login-validator')

module.exports = class CreateUser {
  constructor ({ loadUserByEmailRepository } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async createUser (email, password) {
    LoginValidator.validateParams(email, password)

    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {

    }
    throw new UserAlredyExists(email)
  }
}
