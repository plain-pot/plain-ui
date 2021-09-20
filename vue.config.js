const path = require('path')
const resolve = (dir) => path.join(__dirname, './', dir)

const APP_NAME = 'main-application'

module.exports = {
    publicPath: '/plain-ui/',                       // plain-ui仓库专用
    // publicPath: '/plain-ui-pro/',                // plain-ui-pro 仓库专用
    devServer: {
        port: '3334',
        // 关闭主机检查，使微应用可以被 fetch
        disableHostCheck: true,
        // 子应用需要配置跨域
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },
    outputDir: resolve('docs'),
    pages: {
        index: {
            entry: resolve('story/main.tsx'),
            template: 'public/index.html',
            filename: 'index.html',
            title: 'plain-ui-v3-new',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
    css: {
        sourceMap: false,
        loaderOptions: {
            sass: {
                prependData: `@import "src/style/global-import.scss";`
            }
        },
    },
    configureWebpack: {
        output: {
            // 微应用的包名，这里与主应用中注册的微应用名称一致
            library: `CustomApplication${APP_NAME}`,
            // 将你的 library 暴露为所有的模块定义下都可运行的方式
            libraryTarget: "umd",
            // 按需加载相关，设置为 webpackJsonp_vue-projec 即可
            jsonpFunction: `webpackJsonp_${APP_NAME}_project`,
        },
    },
    chainWebpack: config => {
        config.plugins
            .delete('prefetch-index')
            .delete('preload-index')

        config
            .plugin('html-index')
            .tap((args) => {
                args[0].chunksSortMode = 'manual'
                return args
            })

        config.resolve.alias
            .set('story', resolve('story'))
            .set('src', resolve('pro'))
            .set('plain-ui', resolve('src'))

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
