const $utils = require("../build.utils")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "production",
    entry: {
        index: $utils.resolve('src/index.ts')
    },
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
        }
    },
    output: {
        filename: '[name].js',
        path: $utils.resolve('dest'),
        libraryTarget: 'umd',
        // libraryExport: 'default',
        library: 'PlainUIV3',
        globalObject: 'this'
    },
    plugins: [
        new $utils.webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
        alias: {
            '@': $utils.resolve('src'),
            'src': $utils.resolve('src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {loader: 'babel-loader',},
                    {loader: 'ts-loader',}
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            prependData: `@import "src/style/global-import.scss";`
                        }
                    }
                ]
            },
        ]
    }
}