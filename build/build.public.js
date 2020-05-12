const $utils = require('./build.utils')
const buildConfig = require('./build.config')

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
            '@': $utils.resolve('src'),
            'src': $utils.resolve('src'),
            'src-doc': $utils.resolve('src-doc'),
            'plain-utils': $utils.resolve('submodules/plain-utils/index.js'),
            'plain-loading': $utils.resolve('submodules/plain-loading/index.js'),
            'plain-popper': $utils.resolve('submodules/plain-popper/index.ts'),
        }
    },
}