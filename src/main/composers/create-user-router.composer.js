const CreateUserRouter = require('../../presentation/routers/create-user-router')
const CreateUser = require('../../domain/usescases/login/create-user')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const CreateUserRepository = require('../../infra/repositories/create-user-repository')

module.exports = class CreateUserRouterComposer {
  static compose () {
    const emailValidator = new EmailValidator()
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const createUserRepository = new CreateUserRepository()
    const createUser = new CreateUser({
      loadUserByEmailRepository,
      createUserRepository
    })
    return new CreateUserRouter({
      createUser,
      emailValidator
    })
  }
}
