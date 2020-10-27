import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import {DEFAULT_EXTENSIONS} from '@babel/core';
import {terser} from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
import dynamicImport from '@rollup/plugin-dynamic-import-vars'

export default [
    {
        input: 'src/index.ts',
        output: {
            name: 'PlainUIV3',
            dir: 'dist',
            format: 'umd',
            sourcemap: false,
            exports: 'named',
            globals: {vue: 'Vue',}
        },
        external: ['vue'],
        plugins: [
            postcss({
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
            commonjs(),
            resolve(),
            terser(),
            typescript(),
            babel({
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
            }),
            url({
                limit: 100 * 1024, // inline files < 10k, copy files > 10k
                include: ["*.svg"], // defaults to .svg, .png, .jpg and .gif files
                emitFiles: false // defaults to true
            }),
            dynamicImport(),
        ],
    }
]