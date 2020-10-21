const $utils = require("../build.utils")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
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
                    {
                        loader: 'ts-loader', options: {
                            compilerOptions: {
                                "declaration": true,
                                "outDir": "dest",
                            },
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {importLoaders: 0}
                }, {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {plugins: [[require('autoprefixer')],],},
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {importLoaders: 0}
                },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {plugins: [[require('autoprefixer')],],},
                        }
                    },
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