const $utils = require('./build.utils')

module.exports = $utils.argv.release ? require('./release') : require('./doc')
// module.exports = require('./build.release')
// module.exports = require('./build.doc')