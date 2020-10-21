import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import jsx from 'acorn-jsx';
import scss from 'rollup-plugin-scss'
import DartSass from 'dart-sass'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

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
    plugins: [
        scss({
            output: 'dist/index.css',
            prefix: `@import "src/style/global-import.scss";`,
            sass: DartSass,
            processor: css => postcss([autoprefixer({overrideBrowserslist: "Edge 18"})]),
        }),
        resolve(),
        commonjs(),
        typescript(),
        babel({
            babelHelpers: 'bundled',
            presets: ["@vue/cli-plugin-babel/preset"],
            exclude: "**/node_modules/**"
        }),
    ]
}