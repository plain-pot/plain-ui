const $utils = require('../build.utils')
const buildConfig = require('../build.config')

module.exports = {
    publicPath: '/plain-ui/',
    devServer: {port: '3334'},
    outputDir: $utils.resolve('docs'),
    pages: {
        index: {
            entry: $utils.resolve('story/main.tsx'),
            template: 'public/index.html',
            filename: 'index.html',
            title: 'plain-ui-v3',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        pro: {
            entry: $utils.resolve('pro/main.tsx'),
            template: 'public/index.html',
            filename: 'pro.html',
            title: 'plain-ui-pro',
            chunks: ['chunk-vendors', 'chunk-common', 'pro'],
        },
    },
    css: {
        sourceMap: false,
        loaderOptions: {
            sass: {
                prependData: ({resourcePath}) => {
                    const data = [...buildConfig.scss.globalImport]

                    /*if (resourcePath === $utils.resolve("src/style/index.scss")) {
                        data.push(...buildConfig.scss.importOnce)
                    }*/
                    return data.map(path => `@import "${path}";`).join('\n')
                }
            }
        },
    },
    chainWebpack: config => {
        config.plugins
            .delete('prefetch-index')
            .delete('preload-index')
        config.plugins
            .delete('prefetch-pro')
            .delete('preload-pro')

        config
            .plugin('html-index')
            .tap((args) => {
                args[0].chunksSortMode = 'manual'
                return args
            })

        config.resolve.alias
            .set('story', $utils.resolve('story'))
            .set('pro', $utils.resolve('pro'))
        // .set('src', $utils.resolve('src'))

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
