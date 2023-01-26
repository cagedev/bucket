import { tag } from "./quick-tag.js";
import { LabelSelector } from "./label-selector.js";
import { LatexEditor } from "./latex-editor.js";
import { AjaxSubmit } from "./ajax-submit.js";


const template = tag('template', {}, {
    innerHTML: `
        <style>
        :host {
            margin-bottom: 4px;
        }
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
        .border {
            float: left;
            border: 2px solid purple;
            background-color: violet;
            border-radius: 4px;
            margin-right: 4px;
        }
        .fill-right {
            flex-grow: 1;
        }
        .icon {
            font-size: 200%;
            padding-left: 8px;
            padding-right: 8px;
            color: purple;
        }
        </style>

        <div class="container">
            <div class="border" id="left-border">
                <span class="icon">⁝</span>
            </div>
            <div class="fill-right">
                <form action="" id="snippet-editor-form">
                    <!-- Prevent implicit submission of the form -->
                    <button type="submit" disabled style="display: none" aria-hidden="true"></button>                    
                    <details>
                        <summary>
                            <span id="snippet-title"></span>
                            <input type="text" class="full-width" value="" id="form-action-placeholder" />
                        </summary>
                        <label-selector class="full-width hideable" name="tag_names" value=""></label-selector>
                        <textarea class="full-width hideable" name="description"></textarea>
                        <latex-editor name="content" class="full-width hideable" value=""></latex-editor>
                        <div class="full-width">
                            <ajax-submit method="GET" auto="on" id="load-button">Load</ajax-submit>
                            <ajax-submit method="PUT" id="save-button">Save</ajax-submit>
                            <ajax-submit method="POST" id="save-as-button">Save As...</ajax-submit>
                            <div id="status-text"></div>
                        </div>
                    </details>
                </form>
            </div>
        </div>
`});

/**
 * SnippetEditor CustomElement
 * @attribute {string} url - api endpoint (required)   
 * @class
 **/
export class SnippetEditor extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // DOM references
        // Subcomponent references
        this._form = this.shadowRoot.getElementById('snippet-editor-form');
        this._details = this.shadowRoot.querySelector("#snippet-editor-form > details");
        this._summary = this.shadowRoot.getElementById('snippet-title');
        this._formActionHolder = this.shadowRoot.getElementById('form-action-placeholder');
        this._border = this.shadowRoot.getElementById('left-border');

        // Snippet buttons
        this._saveButton = this.shadowRoot.getElementById('save-button');
        this._saveAsButton = this.shadowRoot.getElementById('save-as-button');
        this._loadButton = this.shadowRoot.getElementById('load-button');

        // Default property values
        // NOTE: Attributes are overwritten by attributeChangedCallback
        // Properties
        this._data = {};
        // Attribute mirrors
        this._token = '';
        this._url = '';
        this._open = 'false'; // Attribute is a string

        // Define custom events
        // QUESTION: Define CustomEvents generally?
        this._foldoutStateChangedEvent = new CustomEvent('foldoutStateChanged', {
            bubbles: false,
            cancelable: false,
            composed: true
        });
    }

    // NOTE: data is passed as json-string
    static get observedAttributes() {
        return ['open', 'token', 'url'];
    }

    // Set js-properties from html-attributes
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            // case 'data':
            //     this._data = JSON.parse(newValue);
            //     break;

            case 'open':
                console.log(newValue);
                if (["true", "false"].includes(newValue)) {
                    this._open = newValue;
                    this._details.open = this._open;

                    // Fire event foldoutStateChanged
                    this._foldoutStateChangedEvent.payload = { 'state': this._open };
                    this.dispatchEvent(this._foldoutStateChangedEvent);
                }
                break;

            case 'token':
                this._token = newValue;
                break;

            case 'url':
                this._url = newValue;
                this._form.action = this._url;
                break;

            default:
                break;
        }
    }

    connectedCallback() {
        // REMOVE: Update snippetId and form action when target is changed manually.
        this._formActionHolder.addEventListener('change', () => {
            // Save new form action
            this._form.action = this._formActionHolder.value;
        });

        // Set event listeners
        this.shadowRoot.addEventListener('DataReady', (event) => {
            this.data = event.payload;
        });

        this._details.addEventListener('toggle', (event) => {
            console.log(event);
            if (this._details.open) {
                this._border.style.backgroundColor = 'lightgreen';
            } else {
                this._border.style.backgroundColor = 'violet';
            }
        });

        // TODO: Drag-n-drop listeners
        // this.addEventListener('dragstart', (event) => {
        //     this.classList.add('dragged');
        //     event.dataTransfer.setData('position', this._position);
        // });
        // this.addEventListener('dragend', () => {
        //     this.classList.remove('dragged');
        // });
    }

    disconnectedCallback() {
        // TODO: Remove event listeners
    }


    // Getters and setters for object properties
    get data() {
        // DEBUG
        // console.log('getting data')
        // TODO
        // update content from subobject
        return this._data;
    }
    set data(val) {
        // TODO: Error checking
        // TODO: Set subobject values
        this._data = val;
        this.loadData();
    }

    // (internal) methods

    loadData() {
        let data = this.data;
        // console.log('loading data...:')
        // console.log(data);
        Array.from(this._form.elements).forEach((element) => {
            // Set data if there is a coressponding form element 
            // NOTE: If field is empty this evaluates to False,
            // explicitly check if data is ''
            if (this.data[element.name] || this.data[element.name] == '') {
                element.value = data[element.name];
            }
        });
        this.render();
    }

    // TODO
    setStatus(status) {
        this._statusText.innerHTML = status;
    }

    // Render/fill in all additional data
    render() {
        this._summary.innerHTML = `id = ${this.data.id}`;
        this._formActionHolder.value = this._url;
    }

};

customElements.define('snippet-editor', SnippetEditor);