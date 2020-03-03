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
        }
    },
    externals: {
        vue: 'Vue',
    },
}