const UserAlredyExists = require('../errors/user-alredy-exists-error')
const LoginValidator = require('../../../utils/helpers/login-validator')

module.exports = class CreateUser {
  constructor ({ loadUserByEmailRepository, createUserRepository } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.createUserRepository = createUserRepository
  }

  async createUser (email, password) {
    LoginValidator.validateParams(email, password)

    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      const user = await this.createUserRepository.createUser(email, password)
      return user
    }
    throw new UserAlredyExists(email)
  }
}
