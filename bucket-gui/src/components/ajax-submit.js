import { tag } from "./quick-tag";


const template = tag('template', {
    innerHTML: `
    <style>
        :host{
            border: 2px solid purple;
            border-radius: 4px;
            padding: 4px;
            display: flex;
        }
        button {
            margin-right: 4px;
        }
    </style>
    <button id="load-button">Load</button>
    <button id="submit-button">Save</button>
    <div id="status-text"></div>
    `
})

/**
 * Custom HTMLElement for AJAX-submitting to an API.
 * 
 * TODO-V2: This should really be handled by a custom form.
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
        // this._form = this._internals.form;
        this._submitButton = this.shadowRoot.getElementById('submit-button');
        this._loadButton = this.shadowRoot.getElementById('load-button');
        this._statusText = this.shadowRoot.getElementById('status-text');
    }

    connectedCallback() {
        this._submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            let payload = Object.fromEntries(Array.from(this._internals.form.elements).map((element) => {
                console.log(element.name, element.value)
                return [element.name, element.value]
            }));
            this.sendPayload(payload);
        });
        this._loadButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.fetchData();
        });
    }

    sendPayload(payload) {
        let target = this._internals.form.action;
        fetch(target, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload)
        }).then((response) => {
            payload = response.json();
            this.setStatus(`${response.statusText})`);
            return payload;
        }).then((json) => {
            console.log(json);
            this.setStatus(`Saved (Last modified: ${json.last_modified})`);
        }).catch((error) => {
            this.setStatus(error);
        })
    } 
    
    fetchData() {
        let target = this._internals.form.action;
        fetch(target, {
            method: 'GET',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
        }).then((response) => {
            let payload = response.json();
            console.log(response.statusText);
            this.setStatus(`${response.statusText})`);
            return payload;
        }).then((json) => {
            console.log(json);
            this.setStatus(`Loaded (Last modified: ${json.last_modified})`);
            this.loadData(json);
        }).catch((error) => {
            this.setStatus(error);
        })
    }

    // Status should be a seperate element
    setStatus(status) {
        this._statusText.innerHTML = status;
    }

    loadData(payload) {
        Array.from(this._internals.form.elements).forEach((element) => {
            // Set data if there is a coressponding form element 
            console.log(element.name)
            if (payload[element.name]) {
                element.value = payload[element.name];
            }
        });
    }
}

// Make the "ajax-submit" tag available
customElements.define('ajax-submit', AjaxSubmit)
