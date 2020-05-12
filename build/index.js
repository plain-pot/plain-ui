const $utils = require('./build.utils')

module.exports = $utils.argv.release ? require('./build.release') : require('./build.doc')
// module.exports = require('./build.release')
// module.exports = require('./build.doc')