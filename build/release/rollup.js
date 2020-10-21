import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/main.ts',
    output: {
        dir:'dist',
        name: 'PlainUIV3',
        format: 'umd',
        sourcemap: true,
        exports: 'named',
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        babel({
            babelHelpers: 'bundled',
            // presets: ["@vue/cli-plugin-babel/preset"],
            exclude: "**/node_modules/**"
        }),
    ]
}