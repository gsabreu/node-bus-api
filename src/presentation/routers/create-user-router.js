const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class CreateUserRouter {
  constructor ({ createUser, emailValidator } = {}) {
    this.createUser = createUser
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const user = await this.createUser.createUser(email, password)
      return HttpResponse.ok({ user })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
