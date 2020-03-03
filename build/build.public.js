const $utils = require('./build.utils')
$utils.checkEntries('src/components')

module.exports = {
    module: {
        rules: [
            {
                test: /.md$/,
                loader: 'text-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'src': $utils.resolve('src'),
            'src-doc': $utils.resolve('src-doc'),
            'plain-utils': $utils.resolve('submodule/plain-utils/index.js'),
        }
    },
    externals: {
        vue: 'Vue',
    },
}