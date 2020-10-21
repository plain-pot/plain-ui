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

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        name: 'PlainUIV3',
        format: 'umd',
        sourcemap: true,
        exports: 'named',
    },
    acornInjectPlugins: [
        jsx()
    ],
    external: [
        'vue'
    ],
    plugins: [
        scss({
            output: 'dist/index.css',
            prefix: `@import "src/style/global-import.scss";`,
            sass: DartSass,
            processor: css => postcss([autoPrefixer({overrideBrowserslist: "Edge 18"})]),
        }),
        resolve(),
        commonjs(),
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
        typescript({
            "target": "es5",
            "jsx": 'preserve',
            "strict": true,
            "importHelpers": true,
            "moduleResolution": "node",
            "skipLibCheck": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "sourceMap": true,
            "declaration": true,
        }),
    ]
}