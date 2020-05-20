const $utils = require('../build.utils')
const buildConfig = require('../build.config')
const WebpackPublic = require('../build.public')

if (!$utils.argv.all) {
    console.log('build packages...')
}

module.exports = {
    outputDir: $utils.resolve(buildConfig.library.output),
    configureWebpack: $utils.WebpackMerge(WebpackPublic, {
        entry: {
            ...$utils.getEntries(buildConfig.library.packagePath),
        },
        output: {
            filename: `lib/[name].js`,
            libraryTarget: 'umd',
            libraryExport: 'default',
            library: [buildConfig.library.exportName, '[name]'],
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
                prependData: ({resourcePath}) => {
                    const data = [...buildConfig.scss.globalImport]

                    // 分开打包的时候，每个都需要引入 global 以及 public 的scss文件；
                    // 统一打包的时候，每个都需要引入 global文件，只有 src/style/index.scss 需要引入 public这个scss文件
                    if ($utils.argv.package || resourcePath === $utils.resolve("src/style/index.scss")) {
                        data.push(...buildConfig.scss.importOnce)
                    }

                    return data.map(path => `@import "${path}";`).join('\n')
                }
            }
        },
        extract: {
            filename: `css/[name].css`
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