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
            display: flex;
            height: 100%;
            width: 100%;
            margin-bottom: 4px;
        }
        </style>

        <div class="container">
            <form action="" id="snippet-editor-form">
                <details>
                    <summary>snippet-title</summary>
                    <!--//<button id="visibility-toggle">Hide</button>//-->
                    <input type="text" class="full-width" value="http://192.168.1.41:8888/api/snippet/2"
                        id="form-action-placeholder" />
                    <label-selector class="full-width hideable" name="tags" value=""></label-selector>
                    <textarea class="full-width hideable" name="description"></textarea>
                    <latex-editor name="content" class="hideable" value=""></latex-editor>
                    <ajax-submit name="submit-button" class="hideable"></ajax-submit>
                </details>
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
        this._summary = this.shadowRoot.querySelector('summary');

        this._componentsVisible = true;
        this._snippetId = -1;
    }

    connectedCallback() {
        // TODO: Prevent default enter handling

        // Set initial values for form action and snippet title
        this._form.action = this._formActionHolder.value;
        this._snippetId = this._formActionHolder.value.split('/').slice(-1)[0];
        this._summary.innerHTML = `Snippet id=${this._snippetId}`;

        // Keep form action and title in sync with input
        this._formActionHolder.addEventListener('change', () => {
            this._form.action = this._formActionHolder.value;
            this._snippetId = this._formActionHolder.value.split('/').slice(-1)[0];
            this._summary.innerHTML = `Snippet id=${this._snippetId}`;
        });

        // Toggle editor visibility
        // The show/hide button is replaced with the details/summary-tag
        // this._visibilityToggle.addEventListener('click', (event) => {
        //     event.preventDefault();
        //     this._componentsVisible = !this._componentsVisible;
        //     let displayStyle = this._componentsVisible ? 'block' : 'none';
        //     this.shadowRoot.querySelectorAll('.hideable').forEach((element) => {
        //         element.style.display = displayStyle;
        //     });
        //     this._visibilityToggle.innerText = this._componentsVisible ? 'Hide' : 'Show';
        // })
    }

};

customElements.define('snippet-editor', SnippetEditor);