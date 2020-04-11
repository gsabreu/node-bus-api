const CreateUserComposer = require('../composers/create-user-router.composer')
const { adapt } = require('../adapters/express-router-adapter')

module.exports = router => {
  const createUserRouter = CreateUserComposer.compose()
  router.post('/user', adapt(createUserRouter))
}
