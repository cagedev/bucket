import { EditorView, basicSetup } from 'codemirror';
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';

import { tag } from "./quick-tag";


const template = tag('template', {
    innerHTML: `
    <style>
        .cm-wrap {
            border: 1px solid darkblue;
        }
    </style>
    <div id="editor-container"></div>
    `
})


export class LatexEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        let myParent = this.shadowRoot.getElementById('editor-container');
        let editor = new EditorView({
            extensions: [
                basicSetup,
                StreamLanguage.define(stex),
                EditorView.lineWrapping,
                EditorView.theme({
                    "&": { maxHeight: "500px" },
                    ".cm-scroller": { overflow: "auto" },
                    ".cm-content, .cm-gutter": { minHeight: "200px" }
                })
            ],
            parent: myParent,
        })
    }
}

customElements.define('latex-editor', LatexEditor)