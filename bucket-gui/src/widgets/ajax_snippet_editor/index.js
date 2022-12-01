import "./container.css"

import { LatexEditor } from "../../components/latex-editor";
import { AjaxSubmit } from "../../components/ajax-submit";

// TODO: This should be done in the custom form
document.addEventListener('DOMContentLoaded', () => {
    let action = document.getElementById('form-action-placeholder');
    document.getElementById('snippet-editor-form').action = action.value;
    action.addEventListener('change', () => {
        document.getElementById('snippet-editor-form').action = action.value;
    });
});

