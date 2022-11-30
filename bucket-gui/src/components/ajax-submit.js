import { tag } from "./quick-tag";


const template = tag('template', {
    innerHTML: `
    <style>
        :host{
            border: 2px solid purple;
            border-radius: 4px;
            padding: 4px;
        }
    </style>
    <button id="submit-button">Save</button>
    <div id="status-text"></div>
    `
})

/**
 * Custom HTMLElement containing a LaTeX-customized CodeMirror6 instance.
 * 
 * @class
 */
export class AjaxSubmit extends HTMLElement {

    static formAssociated = true;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._internals = this.attachInternals();
    }

    connectedCallback() {
        console.log('connectedCallback()');

        let _form = this._internals.form;
        let _submitButton = this.shadowRoot.getElementById('submit-button');
        let _statusText = this.shadowRoot.getElementById('status-text');
        _submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(Object.fromEntries(Array.from(_form.elements).map((element) => { return [element.name, element.value] })));
            _statusText.innerHTML = "updated"
        });
    }
}

// Make the "ajax-submit" tag available
customElements.define('ajax-submit', AjaxSubmit)
