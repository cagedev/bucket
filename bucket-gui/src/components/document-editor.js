import { tag } from './quick-tag';
import { SnippetEditor } from './snippet-editor';
// import { SnippetDivider } from './snippet-divider';

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

const template = tag('template', {}, {
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
    }        
    .full-width {
        border: 2px solid purple;
        border-radius: 4px;
        padding: 4px;
        height: 100%;
        width: 100%;
        margin-bottom: 4px;
    }
    </style>
    <div id="editor-container" class="container">
        TODO: Document metadata <br />

        <div class="container">
            ID=<input type="text" id="document-id-placeholder" />
        </div>

        <div class="container">
            <textarea class="full-width" name="description" id="document-description"></textarea>
        </div>

        <div class="container">
            TODO: Stylesheet-editor
        </div>

        <div class="container full-width" id="snippet-container"></div>

        <hr>

        <button id="add-snippet">Add Snippet</button><br />

        <button id="load-document">Load document</button>
        <button id="save-document">Save document</button>
        <button id="empty-document">Empty document</button>
    </div>`
});

const exampleData = `{
    "content": "...",
    "created": "Tue, 06 Dec 2022 22:59:56 GMT",
    "description": "trying to associate 2",
    "id": 12,
    "last_modified": "Tue, 06 Dec 2022 22:59:56 GMT",
    "snippets": [
      {
        "content": null,
        "created": "Sun, 20 Nov 2022 11:30:18 GMT",
        "description": null,
        "document_ids": [
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          19,
          20,
          20,
          20,
          20,
          20,
          21,
          21,
          21,
          5
        ],
        "id": 10,
        "last_modified": "Wed, 30 Nov 2022 10:41:00 GMT",
        "tag_names": [
          "a",
          "c",
          "d"
        ]
      }
    ],
    "tags": []
}`;


export class DocumentEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // DOM references
        // Document form fields
        this._documentIdField = this.shadowRoot.getElementById('document-id-placeholder');
        this._descriptionField = this.shadowRoot.getElementById('document-description');

        // Document form buttons
        this._addSnippetButton = this.shadowRoot.getElementById('add-snippet');
        this._loadDocumentButton = this.shadowRoot.getElementById('load-document');
        this._saveDocumentButton = this.shadowRoot.getElementById('save-document');
        this._emptyDocumentButton = this.shadowRoot.getElementById('empty-document');

        this._snippetContainer = this.shadowRoot.getElementById('snippet-container');

        this._snippetEditors = [];
        // this._snippetDividers = [];

        // Default values depending on server
        this._host = 'http://127.0.0.1:8888/';

        // Default values depending on api
        this._apiRoute = 'api/';
        this._documentEndpoint = 'document/';
        this._snippetEndpoint = 'snippet/';

        // Document data object
        this._data = {}

        // Parsed object data
        // TODO: Use getters and setters
        this._docId = 5;
        this._snippetList = [];
        this._description = '';
    }


    connectedCallback() {
        // DEBUG
        // console.log(`connectedCallback for docId=${this._docId}`);

        // Set initial values
        this._documentIdField.value = this._docId;

        // REMOVE: Update _docId when _documentIdField is changed manually.
        this._documentIdField.addEventListener('change', () => {
            this._docId = this._documentIdField.value;
            // console.log(`docId changed to =${this._docId}`);
        });

        // Update _description when _descriptionField is changed manually.
        this._descriptionField.addEventListener('change', () => {
            this._description = this._descriptionField.value;
            // DEBUG
            // console.log(`description changed to =${this._description}`);
        });

        // WIP: Add snippet to document 
        // TODO: pass the position
        this._addSnippetButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.addSnippet(null, () => { this.render() });
        });

        // DEBUG: Empty document
        this._emptyDocumentButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.emptyDocument();
        });

        // WIP: Save document
        this._saveDocumentButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.saveDocument();
        });

        // WIP: Load document
        // TODO: Load snippet data in directly
        this._loadDocumentButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.fetchData(() => { this.render() }); // async
        });

        // WIP: Reorder snippets
        this.addEventListener('reorder', (event) => {
            // console.log('event reorder');
            console.log(event);
            this.reorderSnippets(event.detail.newPosition, event.detail.oldPosition);
        })
    }


    // Render the document composer
    render() {
        // DEBUG
        // console.log('render-start')

        // Render the snippets
        this._snippetEditors.forEach((element, index) => {
            // console.log(index)
            this._snippetContainer.append(element);
            // this._snippetContainer.append(
            //     tag('snippet-divider', {
            //         'position': index,
            //     })
            // );
        });

        // DEBUG
        // console.log('render-end')
    }


    // Remove document data
    emptyDocument() {
        this._snippetEditors.forEach((element) => {
            element.remove();
        });
        this._snippetEditors = [];

        this._snippetContainer.replaceChildren();
        // this._snippetDividers = [];
        this._docId = -1;
        this._snippetList = [];
        this._description = '';
    }


    // Load document from api data
    // REMOVE: Use render
    loadDocument() {
        if (this._data.description) {
            console.log(this._data.description);
        }
        if (this._data.snippets) {
            this._data.snippets.forEach((element) => {
                // BUG: This results in multiple api calls when all data has already been returned
                // TODO: Build snippet with complete snippet object
                this.addSnippet(element);
            });
        }
    }


    // TODO: Allow passing of position
    addSnippet(snippetData, callback) {
        if (snippetData == null) {
            // TODO: Tag-search modal
            // TEMP: Add snippet via id prompt 
            snippetData = {
                id: window.prompt('snippetId', 1)
            };
        }

        // TODO: Add in a different position and reorder
        // Add to the end of the list (editor is added on the previous postion)
        let newSnippet = tag('snippet-editor', {
            'url': `${this._host}${this._apiRoute}${this._snippetEndpoint}${snippetData.id}`,
            'token': '0000',
            'open': true
        }, {
            'data': snippetData,
        });

        // Keep track of snippet in DOM 
        this._snippetEditors.push(newSnippet);

        // Manage snippet data
        // REMOVE: Use data in snippet
        this._snippetList.push(snippetData.id);

        if (callback) {
            callback();
        }
    }


    // WIP
    // BUG Not reordering correctly, getting pretty convoluted
    reorderSnippets(start, end) {
        start = parseInt(start)
        end = parseInt(end)
        console.log(start, end)

        if (start != end) {
            let order = [...Array(this._snippetList.length).keys()]
            console.log(order)
            order.move(start, end)
            console.log(order)


            wrapper.append($.map(arr, function (v) { return items[v] }));


            // let snippetElements = this._snippetContainer.getElementsByTagName('snippet-editor')
            // let dividerElements = this._snippetContainer.getElementsByTagName('snippet-divider')

            // let moveElement = snippetElements[start]
            // let newPreviousSibling = dividerElements[end]

            // // moveElement.parentNode.removeChild(moveElement)
            // newPreviousSibling.nextElementSibling = moveElement;
            // console.log(snippetElements)
        }
    }


    // WIP
    removeSnippet(position = -1) {
        if (position == -1) {
            this._snippetList.pop();
        }
        else if (position < this._snippetList.length) {
            this._snippetList.splice(position, 1);
        }
        // else invalidposition -> do nothing or Throw error?
    }


    // WIP: Encapsulate in object 
    saveDocument() {

        // Refresh snippetList
        // QUESTION: Is this required? Data should be in sync by callback
        // this._snippetList = [];
        // this._snippetContainer.querySelectorAll('snippet-editor').forEach((node) => {
        //     this._snippetList.push(node._snippetId);
        // });

        // WIP: Send to endpoint
        // DEBUG: Log to console
        console.log({
            description: this._descriptionField.value,
            snippets: this._snippetList,
        });
    }


    // Fetch data from api -> this._data and call loadDocument
    fetchData(callback) {
        let target = `${this._host}${this._apiRoute}${this._documentEndpoint}${this._docId}`;
        fetch(target, {
            method: 'GET',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
        }).then((response) => {
            let payload = response.json();
            return payload;
        }).then((json) => {
            this._data = json;
            this.loadDocument();
            if (callback) {
                callback();
            }
        }).catch((error) => {
            console.log(error);
        })
    }

}

customElements.define('document-editor', DocumentEditor);