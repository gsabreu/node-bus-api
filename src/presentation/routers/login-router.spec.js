class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        stausCode: 400
      }
    }
  }
}

describe('Login Router', () => {
  test('Should return 400 if email isnt provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.stausCode).toBe(400)
  })

  test('Should return 400 if password isnt provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.stausCode).toBe(400)
  })
})
