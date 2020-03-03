const $utils = require('./build.utils')
const WebpackPublic = require('./build.public')

console.log('building dist for release')

module.exports = {
    outputDir: $utils.resolve('docs/lib'),
    configureWebpack: $utils.WebpackMerge(WebpackPublic, {
        entry: {
            ...$utils.getEntries('src/components'),
            // 'theme-default': $utils.resolve('src/styles/theme/default.scss'),
            // 'theme-dark': $utils.resolve('src/styles/theme/dark.scss'),
        },
        output: {
            filename: `[name].js`,
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: ['PlainUI', '[name]'],
            globalObject: 'this'
        },
    }),
    css: {
        sourceMap: true,
        extract: {
            filename: `[name].css`
        }
    },
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
        config.plugins.delete('copy')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        config.plugins.delete('html')
        config.plugins.delete('hmr')
        config.entryPoints.delete('app')

        config.resolve.alias
            .delete('vue$')
            .delete('@')
    },
}