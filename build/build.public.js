const $utils = require('./build.utils')
$utils.checkEntries('src/components')

module.exports = {
    module: {
        rules: [
            {
                test: /.md$/,
                loader: 'text-loader'
            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'src': $utils.resolve('src'),
            'src-doc': $utils.resolve('src-doc'),
            'plain-utils': $utils.resolve('submodules/plain-utils/index.js'),
            'plain-loading': $utils.resolve('submodules/plain-loading/index.js'),
            'plain-popper': $utils.resolve('submodules/plain-popper/index.ts'),
        }
    },
    externals: {
        vue: 'Vue',
    },
}