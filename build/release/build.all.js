const $utils = require('../build.utils')
const buildPackage = require('./build.package')
const buildConfig = require('../build.config')

console.log('build all...')

buildPackage.configureWebpack.entry = {
    'plain-ui': $utils.resolve('src/index.ts')
}

buildPackage.configureWebpack.output = {
    filename: `[name].js`,
    libraryTarget: 'umd',
    library: [buildConfig.library.exportName],
    globalObject: 'this'
}

buildPackage.css.extract.filename = `[name].css`

module.exports = buildPackage