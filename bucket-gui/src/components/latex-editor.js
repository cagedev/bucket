import { EditorView, basicSetup } from 'codemirror';
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';

import { tag } from "./quick-tag";


const template = tag('template', {
    innerHTML: `
    <style>
        :host {
            border: 2px solid purple;
            border-radius: 4px;
            padding: 4px;
            display: block;
            height: 100%;
            width: 100%;
            margin-bottom: 4px;
        }
    </style>
    <div id="editor-container"></div>
    `
})

/**
 * Custom HTMLElement containing a LaTeX-customized CodeMirror6 instance.
 * 
 * @class
 */
export class LatexEditor extends HTMLElement {

    // Make LatexEditor form-associated
    static formAssociated = true;

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
        });

        this._value = '';
        this._internals = this.attachInternals();
    }

    connectedCallback() {
        console.log('connectedCallback()');
        this._value = this.hasAttribute('value') ? this.getAttribute('value') : '';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
    }

    get form() {
        return this._internals.form;
    }

    get name() {
        return this.getAttribute('name');
    }

    static get observedAttributes() {
        return ['name', 'value'];
    }
}

// Make the "latex-editor" tag available
customElements.define('latex-editor', LatexEditor)