import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import jsx from 'acorn-jsx';
import scss from 'rollup-plugin-scss'
import DartSass from 'dart-sass'
import postcss from 'postcss'
import autoPrefixer from 'autoprefixer'
import {DEFAULT_EXTENSIONS} from '@babel/core';
import {terser} from "rollup-plugin-terser";

const config = {
    acornInjectPlugins: [jsx()],
    external: ['vue'],

    plugins: {
        scss: scss({
            output: 'dist/index.css',
            prefix: `@import "src/style/global-import.scss";`,
            sass: DartSass,
            processor: css => postcss([autoPrefixer({overrideBrowserslist: "Edge 18"})]),
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
    {
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
            config.plugins.scss,
            config.plugins.typescript((tsConfig) => {

            }),
            config.plugins.terser,
            config.plugins.babel,
        ]
    },
]