import { tag } from "./quick-tag.js";
import { LabelSelector } from "./label-selector.js";
import { LatexEditor } from "./latex-editor.js";
import { AjaxSubmit } from "./ajax-submit.js";


const template = tag('template', {
    innerHTML: `
        <style>
        .container {
            left: 0px;
            top: 0px;
            padding: 5px;
            width: 98%;
            height: 98%;
        }        
        .full-width {
            border: 2px solid purple;
            border-radius: 4px;
            padding: 4px;
            display: block;
            height: 100%;
            width: 100%;
            margin-bottom: 4px;
        }
        </style>

        <div class="container">
            <form action="" id="snippet-editor-form">
                <button id="visibility-toggle">Hide</button>
                <input type="text" class="full-width" value="http://192.168.1.41:8888/api/snippet/2"
                    id="form-action-placeholder" />
                <label-selector class="full-width hideable" name="tags" value=""></label-selector>
                <textarea class="full-width hideable" name="description"></textarea>
                <latex-editor name="content" class="hideable" value=""></latex-editor>
                <ajax-submit name="submit-button" class="hideable"></ajax-submit>
            </form>
        </div>
`});

export class SnippetEditor extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._formActionHolder = this.shadowRoot.getElementById('form-action-placeholder');
        this._form = this.shadowRoot.getElementById('snippet-editor-form')
        this._visibilityToggle = this.shadowRoot.getElementById('visibility-toggle')
        this._componentsVisible = true;


    }

    connectedCallback() {
        // Set event listener for api target (only set after DOM loaded)
        // BUG: If element is created after DOMContentLoaded thiis doesn't fire...
        // Use connectedCallback
        // document.addEventListener('DOMContentLoaded', () => {

        // Keep form action in sync with input
        this._form.action = this._formActionHolder.value;
        this._formActionHolder.addEventListener('change', () => {
            this._form.action = this._formActionHolder.value;
        });

        // Toggle editor visibility
        this._visibilityToggle.addEventListener('click', (event) => {
            event.preventDefault();
            this._componentsVisible = !this._componentsVisible;
            let displayStyle = this._componentsVisible ? 'block' : 'none';
            this.shadowRoot.querySelectorAll('.hideable').forEach((element) => {
                element.style.display = displayStyle;
            });
            this._visibilityToggle.innerText = this._componentsVisible ? 'Hide' : 'Show';
        })

        // });

    }

};

customElements.define('snippet-editor', SnippetEditor);