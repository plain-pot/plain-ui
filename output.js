const a = {
    mode: 'development',
    context: 'D:\\6_workspace\\0_plain-pot\\plain-ui',
    devtool: 'cheap-module-eval-source-map',
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    output: {
        path: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\docs\\lib',
        filename: '[name].js',
        publicPath: '/',
        globalObject: 'this',
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: [
            'PlainUI',
            '[name]'
        ]
    },
    resolve: {
        extensions: [
            '.mjs',
            '.js',
            '.jsx',
            '.vue',
            '.json',
            '.wasm',
            '.ts',
            '.tsx',
            '.js',
            '.vue',
            '.json'
        ],
        modules: [
            'node_modules',
            'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules',
            'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\@vue\\cli-service\\node_modules'
        ],
        alias: {
            src: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src',
            'src-doc': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src-doc',
            'plain-utils': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\submodules\\plain-utils\\index.js',
            'plain-loading': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\submodules\\plain-loading\\index.js',
            'plain-popper': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\submodules\\plain-popper\\index.ts'
        }
    },
    resolveLoader: {
        modules: [
            'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\@vue\\cli-plugin-typescript\\node_modules',
            'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\@vue\\cli-plugin-babel\\node_modules',
            'node_modules',
            'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules',
            'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\@vue\\cli-service\\node_modules'
        ]
    },
    module: {
        noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
        rules: [
            /* config.module.rule('vue') */
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\.cache\\vue-loader',
                            cacheIdentifier: '78a09746'
                        }
                    },
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            },
                            cacheDirectory: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\.cache\\vue-loader',
                            cacheIdentifier: '78a09746'
                        }
                    }
                ]
            },
            /* config.module.rule('images') */
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            /* config.module.rule('svg') */
            {
                test: /\.(svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            /* config.module.rule('media') */
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            /* config.module.rule('fonts') */
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            /* config.module.rule('pug') */
            {
                test: /\.pug$/,
                oneOf: [
                    /* config.module.rule('pug').oneOf('pug-vue') */
                    {
                        resourceQuery: /vue/,
                        use: [
                            {
                                loader: 'pug-plain-loader'
                            }
                        ]
                    },
                    /* config.module.rule('pug').oneOf('pug-template') */
                    {
                        use: [
                            {
                                loader: 'raw-loader'
                            },
                            {
                                loader: 'pug-plain-loader'
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('css') */
            {
                test: /\.css$/,
                oneOf: [
                    /* config.module.rule('css').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('css').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('css').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('css').oneOf('normal') */
                    {
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('postcss') */
            {
                test: /\.p(ost)?css$/,
                oneOf: [
                    /* config.module.rule('postcss').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('postcss').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('postcss').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('postcss').oneOf('normal') */
                    {
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('scss') */
            {
                test: /\.scss$/,
                oneOf: [
                    /* config.module.rule('scss').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('scss').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('scss').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('scss').oneOf('normal') */
                    {
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('sass') */
            {
                test: /\.sass$/,
                oneOf: [
                    /* config.module.rule('sass').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    sassOptions: {
                                        indentedSyntax: true
                                    }
                                }
                            }
                        ]
                    },
                    /* config.module.rule('sass').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    sassOptions: {
                                        indentedSyntax: true
                                    }
                                }
                            }
                        ]
                    },
                    /* config.module.rule('sass').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    sassOptions: {
                                        indentedSyntax: true
                                    }
                                }
                            }
                        ]
                    },
                    /* config.module.rule('sass').oneOf('normal') */
                    {
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                    sassOptions: {
                                        indentedSyntax: true
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('less') */
            {
                test: /\.less$/,
                oneOf: [
                    /* config.module.rule('less').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('less').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('less').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    /* config.module.rule('less').oneOf('normal') */
                    {
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('stylus') */
            {
                test: /\.styl(us)?$/,
                oneOf: [
                    /* config.module.rule('stylus').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'stylus-loader',
                                options: {
                                    sourceMap: true,
                                    preferPathResolver: 'webpack'
                                }
                            }
                        ]
                    },
                    /* config.module.rule('stylus').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'stylus-loader',
                                options: {
                                    sourceMap: true,
                                    preferPathResolver: 'webpack'
                                }
                            }
                        ]
                    },
                    /* config.module.rule('stylus').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2,
                                    modules: true,
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'stylus-loader',
                                options: {
                                    sourceMap: true,
                                    preferPathResolver: 'webpack'
                                }
                            }
                        ]
                    },
                    /* config.module.rule('stylus').oneOf('normal') */
                    {
                        use: [
                            {
                                loader: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                                options: {
                                    hmr: true,
                                    publicPath: ''
                                }
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'stylus-loader',
                                options: {
                                    sourceMap: true,
                                    preferPathResolver: 'webpack'
                                }
                            }
                        ]
                    }
                ]
            },
            /* config.module.rule('js') */
            {
                test: /\.m?jsx?$/,
                exclude: [
                    function () { /* omitted long function */
                    }
                ],
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\.cache\\babel-loader',
                            cacheIdentifier: '2ab11af1'
                        }
                    },
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            /* config.module.rule('ts') */
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\.cache\\ts-loader',
                            cacheIdentifier: 'd5b15df6'
                        }
                    },
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            appendTsSuffixTo: [
                                '\\.vue$'
                            ],
                            happyPackMode: false
                        }
                    }
                ]
            },
            /* config.module.rule('tsx') */
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\node_modules\\.cache\\ts-loader',
                            cacheIdentifier: 'd5b15df6'
                        }
                    },
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: false,
                            appendTsxSuffixTo: [
                                '\\.vue$'
                            ]
                        }
                    }
                ]
            },
            {
                test: /.md$/,
                loader: 'text-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        /* config.plugin('vue-loader') */
        new VueLoaderPlugin(),
        /* config.plugin('define') */
        new DefinePlugin(
            {
                'process.env': {
                    NODE_ENV: '"development"',
                    BASE_URL: '"/"'
                }
            }
        ),
        /* config.plugin('case-sensitive-paths') */
        new CaseSensitivePathsPlugin(),
        /* config.plugin('friendly-errors') */
        new FriendlyErrorsWebpackPlugin(
            {
                additionalTransformers: [
                    function () { /* omitted long function */
                    }
                ],
                additionalFormatters: [
                    function () { /* omitted long function */
                    }
                ]
            }
        ),
        /* config.plugin('extract-css') */
        new MiniCssExtractPlugin(
            {
                filename: '[name].css',
                chunkFilename: 'css/[name].[contenthash:8].css'
            }
        ),
        /* config.plugin('progress') */
        new ProgressPlugin(),
        /* config.plugin('fork-ts-checker') */
        new ForkTsCheckerWebpackPlugin(
            {
                vue: true,
                tslint: false,
                formatter: 'codeframe',
                checkSyntacticErrors: false
            }
        )
    ],
    externals: {
        vue: 'Vue'
    },
    entry: {
        base: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\base.js',
        button: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\button\\index.js',
        checkbox: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\checkbox\\index.js',
        dom: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\dom\\index.js',
        icon: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\icon\\index.js',
        index: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\index.js',
        input: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\input\\index.js',
        loading: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\loading\\index.js',
        'plain-ui': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\plain-ui.js',
        popover: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\popover\\index.js',
        popper: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\popper\\index.js',
        radio: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\radio\\index.js',
        scroll: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\scroll\\index.js',
        'select-service': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\select-service\\index.js',
        utils: 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\components\\utils.js',
        'theme-default': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\styles\\entry\\default.scss',
        'theme-dark': 'D:\\6_workspace\\0_plain-pot\\plain-ui\\src\\styles\\entry\\dark.scss'
    }
}
