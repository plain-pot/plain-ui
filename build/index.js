const $utils = require('./build.utils')

module.exports = $utils.argv.release ? require('./build.lib') : require('./build.doc')
// module.exports = require('./config.lib')
// module.exports = require('./config.doc')