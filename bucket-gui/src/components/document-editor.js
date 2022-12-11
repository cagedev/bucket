import { tag } from './quick-tag';
import { SnippetEditor } from './snippet-editor';

const template = tag('template', {
    innerHTML: `
    <style></style>
    <div id="editor-container">
        TODO: Document metadata <br />
        ID=<input type="text" id="document-id-placeholder" />
        <div class="container">
            <textarea class="full-width hideable" name="description" id="document-description"></textarea>
        </div>

        <div class="container">
        TODO: Stylesheet-editor
        </div>

        <div class="container full-width" id="snippet-container">
        </div>

        <button id="add-snippet">Add Snippet</button><br />

        <button id="load-document">Load document</button>
        <button id="save-document">Save document</button>
        </div>
    `
})


export class DocumentEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._snippetContainer = this.shadowRoot.getElementById('snippet-container');
        this._addSnippetButton = this.shadowRoot.getElementById('add-snippet');
        this._saveDocumentButton = this.shadowRoot.getElementById('save-document');
        this._loadDocumentButton = this.shadowRoot.getElementById('load-document');
        this._descriptionField = this.shadowRoot.getElementById('document-description');
        this._documentIdField = this.shadowRoot.getElementById('document-id-placeholder');

        // Assume default document id
        this._docId = 12;
        this._snippetList = []
    }

    connectedCallback() {
        console.log(`connectedCallback for docId=${this._docId}`);

        // Set initial values
        this._documentIdField.value = this._docId;

        // Update docId target is changed manually.
        this._documentIdField.addEventListener('change', () => {
            this._docId = this._documentIdField.value;
            console.log(`docId changed to =${this._docId}`);
        });

        // WIP: Add snippet to document 
        this._addSnippetButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.addSnippet();
        });

        // WIP: Save document
        this._saveDocumentButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.saveDocument();
        });

        // WIP: Load document
        this._loadDocumentButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.fetchData();
        });
    }

    addSnippet(snippetData) {
        if (snippetData == null) {
            // TODO: Tag-search modal
            // TEMP: Add snippet via id prompt 
            snippetData = {
                id: window.prompt('snippetId', 1)
            };
        }

        // TODO: Add server hostname on the fly -> use attributes and pass in via HTML template
        this._snippetContainer.append(
            tag('snippet-editor', {
                'snippetId': snippetData.id,
                // 'host': 'http://localhost:8000/',
                'host': 'http://192.168.1.41:8888/', // local ip
                'route': 'api/snippet/',
            })
        );
        console.log(this._snippetContainer);
    }

    saveDocument() {
        // WIP: Encapsulate in object 

        // Refresh snippetList
        this._snippetList = [];
        this._snippetContainer.querySelectorAll('snippet-editor').forEach((node) => {
            this._snippetList.push(node._snippetId);
        });

        // WIP: Send to endpoint
        // DEBUG: Log to console
        console.log({
            description: this._descriptionField.value,
            snippets: this._snippetList,
        });
    }

    fetchData() {
        console.log(`fetchData(id=${this._docId})`);
        let target = `http://192.168.1.41:8888/api/document/${this._docId}`;
        fetch(target, {
            method: 'GET',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
        }).then((response) => {
            let payload = response.json();
            console.log(response.statusText);
            return payload;
        }).then((json) => {
            console.log(json);
            this.loadData(json);
        }).catch((error) => {
            console.log(error);
        })
    }

    loadData(payload) {
        console.log(payload.snippets);
        payload.snippets.forEach((element) => {
            // BUG: This results in multiple api calls when all data has already been returned
            // TODO: Build snippet with complete snippet object
            console.log(element.id)
            this.addSnippet(element);
        });
    }


}

customElements.define('document-editor', DocumentEditor);