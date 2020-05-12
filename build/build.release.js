const $utils = require('./build.utils')

module.exports = $utils.argv.all ? require('./build.all') : require('./build.package')