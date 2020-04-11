const LoginValidator = require('../helpers/login-validator')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, updateAccessTokenRepository, encrypter, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    LoginValidator.validateParams(email, password)

    const user = await this.loadUserByEmailRepository.load(email)
    if (user && await this.encrypter.compare(password, user.password)) {
      const accessToken = await this.tokenGenerator.generate(user._id)
      await this.updateAccessTokenRepository.update(user._id, accessToken)
      return accessToken
    }
    return null
  }
}
