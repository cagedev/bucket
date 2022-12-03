import "./container.css"

import { SnippetEditor } from "../../components/snippet-editor";
import { tag } from "../../components/quick-tag";

// Set event listener for api target (only set after DOM loaded)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-snippet').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('snippet-container').append(tag('snippet-editor'))
    });
});