const $utils = require('./build/build.utils')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*获取命令行参数*/
const arg = $utils.decodeArgv()
/*添加插件*/
const plugins = []
// !!arg.analysis && plugins.push(new BundleAnalyzerPlugin({analyzerPort: '9999'}))                        //如果命令行参数中存在analysis，则启用webpack-bundle-analysis插件分析打包数据
const isProduction = !!arg.production

const option = {
    publicPath: './',
    outputDir: $utils.resolve('page'),
    productionSourceMap: !isProduction,
    devServer: {
        port: '7555',
    },
    pages: {
        index: {
            // page 的入口
            entry: 'portal/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'plain-ui portal',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },
    configureWebpack: {
        externals: {
            ...(isProduction ? {
                'vue': 'Vue'
            } : {})
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'src': $utils.resolve('src'),
                'portal': $utils.resolve('portal'),
            }
        },
        module: {
            rules: [
                {
                    test: /.md$/,
                    loader: 'text-loader'
                },
            ]
        },
        plugins: [
            ...plugins,
        ]
    },
    css: {
        sourceMap: !isProduction,
        loaderOptions: {
            sass: {
                data: `@import "src/styles/global.scss"; @import "portal/global.scss";`
            }
        }
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch-index')
    }
}

module.exports = option