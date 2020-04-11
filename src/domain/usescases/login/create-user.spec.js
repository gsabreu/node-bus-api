const MissingParamError = require('../../../utils/errors/missing-param-error')
const UserAlredyExists = require('../errors/user-alredy-exists-error')
const CreateUser = require('./create-user')

const createLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  return loadUserByEmailRepositorySpy
}

const createSut = () => {
  const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpy()
  const sut = new CreateUser({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy
  })
  return { sut, loadUserByEmailRepositorySpy }
}

describe('Create User Usecase', () => {
  test('should throw missing param error for email ', () => {
    const { sut } = createSut()
    const promise = sut.createUser()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw missing param error for password ', () => {
    const { sut } = createSut()
    const promise = sut.createUser('email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should throw with email alredy exists', () => {
    const { sut, loadUserByEmailRepositorySpy } = createSut()
    loadUserByEmailRepositorySpy.user = {
      id: 'id',
      email: 'email@email.com'
    }
    const promise = sut.createUser('email@email.com', 'any_pass')
    expect(promise).rejects.toThrow(new UserAlredyExists('email@email.com'))
  })
})
