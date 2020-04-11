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

const createCreateUserRepositorySpy = () => {
  class CreateUserRepositorySpy {
    async createUser (email, password) {
      this.email = email
      this.password = password
      return this.user
    }
  }
  const createUserRepositorySpy = new CreateUserRepositorySpy()
  createUserRepositorySpy.user = {
    email: 'email@email.com'
  }
  return createUserRepositorySpy
}

const createSut = () => {
  const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpy()
  const createUserRepositorySpy = createCreateUserRepositorySpy()
  const sut = new CreateUser({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    createUserRepository: createUserRepositorySpy
  })
  return { sut, loadUserByEmailRepositorySpy, createUserRepositorySpy }
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

  test('should return throw', async () => {
    const { sut } = createSut()
    const user = await sut.createUser('email@email.com', 'any_pass')
    expect(user.email).toBe('email@email.com')
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const loadUserByEmailRepository = createLoadUserByEmailRepositorySpy()
    const createUserRepository = createCreateUserRepositorySpy()
    const suts = [].concat(
      new CreateUser(),
      new CreateUser({ loadUserByEmailRepository: null }),
      new CreateUser({ loadUserByEmailRepository: {} }),
      new CreateUser({
        loadUserByEmailRepository
      }),
      new CreateUser({
        loadUserByEmailRepository,
        createUserRepository: {}
      }),
      new CreateUser({
        loadUserByEmailRepository,
        createUserRepository
      })
    )
    for (const sut of suts) {
      const promise = sut.createUser('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
