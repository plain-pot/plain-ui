const $utils = require('../build.utils')
const WebpackPublic = require('../build.public')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

console.log('build doc...')

module.exports = {
    publicPath: '/plain-ui',
    devServer: {port: '3334'},
    outputDir: $utils.resolve('docs'),
    pages: {
        index: {
            entry: $utils.resolve('src-doc/main.js'),
            template: 'public/index.html',
            filename: 'index.html',
            title: 'plain-ui',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
    configureWebpack: $utils.WebpackMerge(WebpackPublic, {
        plugins: [
            new AddAssetHtmlWebpackPlugin([
                {filepath: $utils.resolve('src-doc/lib/vue.min.js')},
                {filepath: $utils.resolve('src-doc/lib/vuex.min.js')},
                {filepath: $utils.resolve('src-doc/lib/vue-composition-api.umd.js')},
            ])
        ],
        externals: {
            vue: 'Vue',
            '@vue/composition-api': 'vueCompositionApi'
        },
    }),
    css: {
        sourceMap: true,
        loaderOptions: {
            sass: {
                prependData: `@import "src/style/global-import.scss";`
            }
        },
    },
    chainWebpack: config => {
        config.plugins
            .delete('prefetch-index')
            .delete('preload-index')

        config.resolve.alias
            .delete('vue$')
            .delete('@')

        config
            .plugin('html-index')
            .tap((args) => {
                args[0].chunksSortMode = 'manual'
                return args
            })

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