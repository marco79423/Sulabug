if (process.env.LOCAL_DEBUG) {
  module.exports = require('./src')
} else {
  module.exports = require('./lib')
}
