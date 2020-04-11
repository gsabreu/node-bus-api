const CreateUserRouter = require('./create-user-router')
const { ServerError } = require('../errors')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const createSut = () => {
  const createUserSpy = createCreateUserSpy()
  const emailValidatorSpy = createEmailValidator()
  const sut = new CreateUserRouter({
    createUser: createUserSpy,
    emailValidator: emailValidatorSpy
  })
  return { sut, createUserSpy, emailValidatorSpy }
}

const createCreateUserSpy = () => {
  class CreateUserSpy {
    async createUser (email, password) {
      this.email = email
      this.password = password
      return this.user
    }
  }
  const createUserSpy = new CreateUserSpy()
  createUserSpy.user = {
    email: 'any_email'
  }
  return createUserSpy
}

const createCreateUserSpyError = () => {
  class CreateUserSpy {
    async auth () {
      throw new Error()
    }
  }
  return new CreateUserSpy()
}

const createEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const createEmailValidatorError = () => {
  class EmailValidatorSpy {
    isValid (email) {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}

describe('Login Router', () => {
  test('Should return 400 if email isnt provided', async () => {
    const { sut } = createSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
  })

  test('Should return 400 if password isnt provided', async () => {
    const { sut } = createSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
  })

  test('Should return 500 httpRequest isnt provided', async () => {
    const { sut } = createSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = createSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, createUserSpy } = createSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(createUserSpy.email).toBe(httpRequest.body.email)
    expect(createUserSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 200 when valid credential are provided', async () => {
    const { sut, createUserSpy } = createSut()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.user).toEqual(createUserSpy.user)
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = createSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('email').message)
  })

  test('Should call EmailValidor with correct email', async () => {
    const { sut, emailValidatorSpy } = createSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const createUserSpy = createCreateUserSpy()

    const suts = [].concat(
      new CreateUserRouter(),
      new CreateUserRouter({}),
      new CreateUserRouter({
        createUser: invalid
      }),
      new CreateUserRouter({
        createUser: createUserSpy
      }),
      new CreateUserRouter({
        createUser: createUserSpy,
        emailValidator: invalid
      }))
    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'any_email',
          password: 'password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('Should throw if dependencies throws', async () => {
    const createUserSpy = createCreateUserSpy()
    const suts = [].concat(
      new CreateUserRouter({
        createUser: createCreateUserSpyError()
      }),
      new CreateUserRouter({
        createUser: createUserSpy,
        emailValidator: createEmailValidatorError()
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'any_email',
          password: 'password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
