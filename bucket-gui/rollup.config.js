// rollup.config.js
import css from 'rollup-plugin-import-css';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
    input: './src/index.js',

    output: {
        file: './build/bundle.js',
        format: 'es',
    },

    plugins: [
        copy({
            targets: [
                {
                    src: './src/index.html',
                    dest: './build',
                    transform: (contents, filename) => {
                        return contents.toString().replaceAll('__TITLE__', 'Bucket LaTeX Editor')
                    }
                }
            ]
        }),
        css(),
        nodeResolve(),
    ],

    // watch: true,
};