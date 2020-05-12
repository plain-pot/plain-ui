const $utils = require('./build.utils')
const PublicWebpack = require('./build.public')
const buildPackage = require('./build.package')
const buildConfig = require('./build.config')

console.log('build all...')

Object.assign(buildPackage, {
    configureWebpack: $utils.WebpackMerge(PublicWebpack, {
        entry: {
            'plain-ui': $utils.resolve('src/index.ts')
        },
        output: {
            filename: `[name].js`,
            libraryTarget: 'umd',
            library: [buildConfig.library.exportName],
            globalObject: 'this'
        },
        externals: {
            vue: 'Vue',
            '@vue/composition-api': {
                root: 'vueCompositionApi',
                commonjs: '@vue/composition-api',
                commonjs2: '@vue/composition-api',
            }
        },
    }),
    css: {
        sourceMap: true,
        loaderOptions: {
            sass: {
                prependData: `@import "src/style/global-import.scss";`
            }
        },
        extract: {
            filename: `[name].css`
        },
    },
})

module.exports = buildPackage