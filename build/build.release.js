const $utils = require('./build.utils')
const WebpackPublic = require('./build.public')

console.log('building dist for release')

module.exports = {
    outputDir: $utils.resolve('docs/lib'),

}