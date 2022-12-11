// rollup.config.js
import css from 'rollup-plugin-import-css';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default [
    // {
    //     input: './src/widgets/html_latex_editor/index.js',

    //     output: {
    //         file: './build/htexedit/bundle.js',
    //         format: 'es',
    //     },

    //     plugins: [
    //         copy({
    //             targets: [
    //                 {
    //                     src: './src/widgets/html_latex_editor/index.html',
    //                     dest: './build/htexedit',
    //                     transform: (contents, filename) => {
    //                         return contents.toString().replaceAll('__TITLE__', 'Bucket LaTeX Editor')
    //                     }
    //                 }
    //             ]
    //         }),
    //         css(),
    //         nodeResolve(),
    //     ],
    // },
    // {
    //     input: './src/widgets/ajax_snippet_editor/index.js',

    //     output: {
    //         file: './build/atexedit/bundle.js',
    //         format: 'es',
    //     },

    //     plugins: [
    //         copy({
    //             targets: [
    //                 {
    //                     src: './src/widgets/ajax_snippet_editor/index.html',
    //                     dest: './build/atexedit',
    //                 }
    //             ]
    //         }),
    //         css(),
    //         nodeResolve(),
    //     ],
    // },
    // {
    //     input: './src/widgets/ajax_document_editor/index.js',

    //     output: {
    //         file: './build/adocedit/bundle.js',
    //         format: 'es',
    //     },

    //     plugins: [
    //         copy({
    //             targets: [
    //                 {
    //                     src: './src/widgets/ajax_document_editor/index.html',
    //                     dest: './build/adocedit',
    //                 }
    //             ]
    //         }),
    //         css(),
    //         nodeResolve(),
    //     ],
    // },
    {
        input: './src/widgets/bucket/index.js',

        output: {
            file: './build/bucket/bundle.js',
            format: 'es',
        },

        plugins: [
            copy({
                targets: [
                    {
                        src: './src/widgets/bucket/index.html',
                        dest: './build/bucket',
                    }
                ]
            }),
            css(),
            nodeResolve(),
        ],
    },
];