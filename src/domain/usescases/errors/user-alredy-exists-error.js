module.exports = class UserAlredyExists extends Error {
  constructor (email) {
    super(`${email} alredy exists`)
    this.name = 'UserAlredyExists'
  }
}
