const LoginRouteComposer = require('../composers/login-router-composer')
const { adapt } = require('../adapters/express-router-adapter')

module.exports = router => {
  const loginRouter = LoginRouteComposer.compose()
  router.post('/login', adapt(loginRouter))
}
