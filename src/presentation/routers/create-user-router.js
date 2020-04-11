const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const UserAlredyExists = require('../../domain/usescases/errors/user-alredy-exists-error')

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
      try {
        const user = await this.createUser.createUser(email, password)
        return HttpResponse.ok({ user })
      } catch (e) {
        if (e instanceof UserAlredyExists) {
          return HttpResponse.badRequest(e)
        }
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
