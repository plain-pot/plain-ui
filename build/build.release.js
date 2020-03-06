const $utils = require('./build.utils')
const WebpackPublic = require('./build.public')

console.log('building dist for release')

module.exports = {
    outputDir: $utils.resolve('docs/lib'),
    configureWebpack: $utils.WebpackMerge(WebpackPublic, {
        entry: {
            ...$utils.getEntries('src/components'),
            'theme-default': $utils.resolve('src/styles/entry/default.scss'),
            'theme-dark': $utils.resolve('src/styles/entry/dark.scss'),
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

        const fontRule = config.module.rule('fonts')
        fontRule.uses.clear()
        fontRule
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .use('url')
            .loader('url-loader')
            .options({
                limit: 4096,
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            })
    },
}