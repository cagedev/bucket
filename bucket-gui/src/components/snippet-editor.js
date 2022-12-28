import { tag } from "./quick-tag.js";
import { LabelSelector } from "./label-selector.js";
import { LatexEditor } from "./latex-editor.js";
import { AjaxSubmit } from "./ajax-submit.js";


const template = tag('template', {
    innerHTML: `
        <style>
        * {
            box-sizing: border-box;
        }
        .container {
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            display: flex;
        }        
        .full-width {
            border: 2px solid purple;
            border-radius: 4px;
            padding: 4px;
            height: 100%;
            width: 100%;
            margin-bottom: 4px;
        }
        .dragged {
            opacity: 0.2;
        }
        .left-border {
            float: left;
            width: 40px;
            background-color: green;
        }
        .fill-right {
            flex-grow: 1;
        }
        </style>

        <div class="container">
            <div class="left-border">
                <span>
                    -
                    -
                    -
                </span>
            </div>
            <div class="fill-right">
                <form action="" id="snippet-editor-form">
                    <details>
                        <summary>snippet-title</summary>
                        <input type="text" class="full-width" value=""
                            id="form-action-placeholder" />
                        <label-selector class="full-width hideable" name="tag_names" value=""></label-selector>
                        <textarea class="full-width hideable" name="description"></textarea>
                        <latex-editor name="content" class="hideable" value=""></latex-editor>
                        <ajax-submit name="submit-button" class="hideable" id="iobutton"></ajax-submit>
                    </details>
                </form>
            </div>
        </div>
`});

export class SnippetEditor extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Subcomponent references
        this._formActionHolder = this.shadowRoot.getElementById('form-action-placeholder');
        this._form = this.shadowRoot.getElementById('snippet-editor-form')
        this._visibilityToggle = this.shadowRoot.getElementById('visibility-toggle')
        this._summary = this.shadowRoot.querySelector('summary');

        // TODO: Refactor save/load code into snippet-editor component
        this._ajaxSubmit = this.shadowRoot.getElementById('iobutton');

        // Set default property values
        // NOTE: If set in the component these are overwritten in connectedCallback
        // TODO: Set summary visiblity with attribute
        // this._componentsVisible = true;
        this._host = 'http://127.0.0.1:8000/'
        this._route = 'api/snippet/'
        this._snippetId = -1;
        this._position = -1;
        // this._value = '';

        this.addEventListener('dragstart', (event) => {
            this.classList.add('dragged');
            event.dataTransfer.setData('position', this._position);
        });
        this.addEventListener('dragend', () => {
            this.classList.remove('dragged');
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(`attributeChanged(${name}, ${oldValue}, ${newValue})`)
        if (name == 'position') {
            this.position = newValue
            // this._position = newValue;
        }
    }


    connectedCallback() {
        // TODO: Prevent default enter handling
        console.log(`connectedCallback for snippetId=${this._snippetId}`);

        // Set initial values for form action and snippet title
        // TODO: Set these based on snippetId
        let target = `${this._host}${this._route}${this._snippetId}`;
        this._form.action = target;
        this._formActionHolder.value = target;
        this._summary.innerHTML = `snippetId=${this._snippetId}`;

        // REMOVE: Update snippetId and form action when target is changed manually.
        this._formActionHolder.addEventListener('change', () => {
            // TODO: Back-sync with attributes [host, route, snippetId]
            this._form.action = this._formActionHolder.value;
            this._snippetId = this._formActionHolder.value.split('/').slice(-1)[0];
            this._summary.innerHTML = `Snippet id=${this._snippetId}`;
        });

        // DEBUG
        // console.log(`this._host=${this._host}`);
        // console.log(`this._route=${this._route}`);
        // console.log(`this._snippetId=${this._snippetId}`);

        // Try to load data via AjaxSubmit
        this.shadowRoot.addEventListener('AjaxSubmitReady', () => {
            // DEBUG
            // console.log(`Trying to fetch data`);
            this._ajaxSubmit.fetchData();
            // DEBUG
            // console.log(`Done fetching data`);
        });


        // REMOVE: Toggle editor visibility
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

    // TODO?: Use full snippet object?
    // get value() { return this._value; }
    // set value(val) { this._value = val; }

    get host() { return this._host; }
    set host(val) {
        console.log(`setting host=${val}`);
        this._host = val;
    }

    get route() { return this._route; }
    set route(val) {
        console.log(`setting route=${val}`);
        this._route = val;
    }

    get snippetId() { return this._snippetId; }
    set snippetId(val) {
        console.log(`setting snippetId=${val}`);
        this._snippetId = val;
    }

    get position() { return this._position; }
    set position(val) {
        // console.log(`setting position=${val}`);
        this._position = val;
    }

    // QUESTION: Are observedattributes required?
    static get observedAttributes() {
        return ['host', 'route', 'snippetId', 'position'];
    }


};

customElements.define('snippet-editor', SnippetEditor);