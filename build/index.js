const $utils = require('./build.utils')

module.exports = $utils.argv.release ? require('./build.release') : require('./build.doc')
// module.exports = require('./config.lib')
// module.exports = require('./config.doc')