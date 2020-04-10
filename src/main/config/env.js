module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:xxx/bus-node-api',
  tokenSecret: process.env.TOKEN_SECRET || 'secret'
}
