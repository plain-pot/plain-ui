const $utils = require('./build.utils')
const WebpackPublic = require('./build.public')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

console.log('building doc')

const PlainUI = 'PlainUI'

module.exports = {
    publicPath: '/plain-ui',
    devServer: {port: '3334'},
    outputDir: $utils.resolve('docs'),
    configureWebpack: $utils.WebpackMerge(WebpackPublic, {
        entry: {
            [PlainUI]: $utils.resolve('src/index.js'),
            'theme-default': $utils.resolve('src/styles/entry/default.scss'),
            'theme-dark': $utils.resolve('src/styles/entry/dark.scss'),
        },
        output: {
            filename: `[name].[hash].js`,
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: ['PlainDoc', "[name]"],
            globalObject: 'this'
        },
        plugins: [
            new $utils.webpack.DefinePlugin({
                LibConfig: JSON.stringify({
                    LIB_NAME: $utils.libraryName
                })
            }),
            // new AddAssetHtmlCdnWebpackPlugin(true, {
            //     vue: 'https://cdn.bootcss.com/vue/2.6.10/vue.js',
            //     vuex: 'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
            // }),
            new AddAssetHtmlWebpackPlugin([
                {filepath: $utils.resolve('src-doc/lib/vue.min.js')},
                {filepath: $utils.resolve('src-doc/lib/vuex.min.js')},
            ])
        ]
    }),
    css: {
        sourceMap: true,
        loaderOptions: {
            sass: {
                prependData: `@import "src-doc/doc.global.scss";`
            }
        }
    },
    pages: {
        index: {
            entry: $utils.resolve('src-doc/index.js'),
            template: 'public/index.html',
            filename: 'index.html',
            title: $utils.entryName,
            chunks: ['chunk-vendors', 'chunk-common', PlainUI, 'theme-default', 'theme-dark', 'index'],
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


    },
}
