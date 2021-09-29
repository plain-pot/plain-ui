const path = require('path')
const resolve = (dir) => path.join(__dirname, './', dir)
const {DefinePlugin} = require('webpack')

const config = {
    title: 'PLAIN UI',                                      // 单页面应用title
    APP_NAME: 'PLAIN_UI_APPLICATION',                       // 每个应用的唯一标识，没有格式限制，只能用下划线命名，因为最后会输出为一个变量名
    publicPath: '/plain-ui/',                               // 部署路径
}

module.exports = {
    publicPath: config.publicPath,                       // plain-ui仓库专用
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
                prependData: `@import "src/styles/global-import.scss";`
            }
        },
    },
    configureWebpack: {
        output: {
            // 微应用的包名，这里与主应用中注册的微应用名称一致
            library: `CustomApplication${config.APP_NAME}`,
            // 将你的 library 暴露为所有的模块定义下都可运行的方式
            libraryTarget: "umd",
            // 按需加载相关，设置为 webpackJsonp_vue-projec 即可
            jsonpFunction: `webpackJsonp_${config.APP_NAME}_project`,
        },
        plugins: [
            new DefinePlugin({
                ENV: JSON.stringify(config),
                APP_ENV: JSON.stringify(require(resolve(`story/env/config/${process.env.APP_ENV}.js`)))
            }),
        ]
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
            .set('async-validator', resolve('src/libs/async-validator/index.js'))
            // .set('plain-ui-composition', 'plain-ui-composition')

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
