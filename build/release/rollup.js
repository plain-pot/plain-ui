import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import {DEFAULT_EXTENSIONS} from '@babel/core';
import {terser} from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss'

const config = {
    external: ['vue'],

    plugins: {
        postcss: postcss({
            extract: 'index.css',
            minimize: true,
            extensions: ['.css', '.scss'],
            config: true,
            use: [
                ['sass', {
                    data: '@import "src/style/global-import.scss";'
                }]
            ]
        }),
        resolve: resolve(),
        commonjs: commonjs(),
        typescript: cb => typescript(cb({
            "target": "es5",
            "jsx": 'preserve',
            "strict": true,
            "importHelpers": true,
            "moduleResolution": "node",
            "skipLibCheck": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
        })),
        terser: terser(),
        babel: babel({
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.ts',
                '.tsx'
            ],
            babelHelpers: 'runtime',
            exclude: "**/node_modules/**",
            presets: [
                '@vue/cli-plugin-babel/preset'
            ],
        })
    }
}

export default [
    /*{
        input: 'src/index.umd.ts',
        output: {
            name: 'PlainUIV3',
            file: 'dist/index.umd.min.js',
            format: 'umd',
            sourcemap: false,
            exports: 'default',
            globals: {vue: 'Vue',}
        },
        acornInjectPlugins: config.acornInjectPlugins,
        external: config.external,
        plugins: [
            config.plugins.commonjs,
            config.plugins.resolve,
            config.plugins.postcss,
            config.plugins.typescript((tsConfig) => tsConfig),
            config.plugins.terser,
            config.plugins.babel,
        ]
    },*/
    {
        input: 'src/index.ts',
        output: {
            name: 'PlainUIV3',
            dir: 'dist',
            format: 'umd',
            sourcemap: true,
            exports: 'named',
            globals: {vue: 'Vue',}
        },
        acornInjectPlugins: config.acornInjectPlugins,
        external: config.external,
        plugins: [
            config.plugins.commonjs,
            config.plugins.resolve,
            config.plugins.postcss,
            config.plugins.typescript((tsConfig) => ({
                ...tsConfig,
                // "declaration": true,
                // "outDir": "dist",
            })),
            config.plugins.terser,
            config.plugins.babel,
        ]
    }
]