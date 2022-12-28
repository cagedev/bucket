import { tag } from './quick-tag'

const template = tag('template', {
    innerHTML: `
    <style>
    .container {
        min-height: 32px;
        background-color: red;
    }
    :hover {
        background-color: green;
    }
    </style>
    <div class="container divider" id="dropzone"></div>`
});

export class SnippetDivider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._dropzone = this.shadowRoot.getElementById('dropzone');

        this._position = -1;

        // Handle drag
        this.addEventListener('dragenter', (event) => {
            // console.log(`dragenter (position=${this._position}, event=${event})`);
        });
        this.addEventListener('dragleave', (event) => {
            // console.log(`dragleave (position=${this._position}, event=${event})`);
        });
        this.addEventListener('dragover', (event) => {
            event.preventDefault();
            // console.log(`dragleave (position=${this._position}, event=${event})`);
        });
        this.addEventListener('drop', (event) => {
            const snippetsReordered = new CustomEvent('reorder', {
                bubbles: true,
                composed: true,
                detail: {
                    newPosition: this._position,
                    oldPosition: event.dataTransfer.getData('position'),
                }
            });
            this.dispatchEvent(snippetsReordered);
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
        console.log(`connectedCallback for divider ${this._position}`);
    }

    get position() { return this._position; }
    set position(val) {
        // console.log(`setting position=${val}`);
        this._position = val;
    }

    static get observedAttributes() {
        return ['position'];
    }


    // handleDragover(event){
    //     console.log(`handle dragover (position=${this._position}, event=${event})`);
    // }

}

customElements.define('snippet-divider', SnippetDivider);