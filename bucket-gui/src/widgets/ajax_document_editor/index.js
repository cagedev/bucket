import "./container.css"

import { SnippetEditor } from "../../components/snippet-editor";
import { tag } from "../../components/quick-tag";

// TODO:
//  - Drag-n-drop reordering
//  - Snippet search (modal?)
//  - Rename document
//  - Document js component
//  - Document db model

// Set event listener for api target (only set after DOM loaded)
document.addEventListener('DOMContentLoaded', () => {
    // Add snippet
    document.getElementById('add-snippet').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('snippet-container').append(tag('snippet-editor'))
    });

    // WIP: Save document
    document.getElementById('save-document').addEventListener('click', (event) => {
        event.preventDefault();

        // WIP: Encapsulate in object 
        // Assume default document id
        let docId = 1;
        // Get a list of snippet ids
        let snippetList = [];
        document.querySelectorAll('snippet-editor').forEach((node) => {
            snippetList.push(node._snippetId);
        });

        // WIP: Send to endpoint
        // DEBUG: Log to console
        console.log(snippetList);
    });

});

