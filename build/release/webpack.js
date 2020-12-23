const $utils = require("../build.utils")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
        path: $utils.resolve('dist'),
        libraryTarget: 'umd',
        // libraryExport: 'default',
        library: 'PlainUI',
        globalObject: 'this'
    },
    plugins: [
        new $utils.webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({filename: 'index.css'}),
        new $utils.webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
        new BundleAnalyzerPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules(?!.*(plain-loading|plain-utils|plain-popper).*)/,
                use: [
                    {loader: 'babel-loader',},
                    {
                        loader: 'ts-loader', options: {
                            allowTsInNodeModules: true,
                        }
                    }
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
            {
                test: /\.(png)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000
                        }
                    }
                ]
            },
        ]
    }
}