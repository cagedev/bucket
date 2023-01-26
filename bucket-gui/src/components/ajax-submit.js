import { tag } from "./quick-tag";


const template = tag('template', {}, {
    innerHTML: `
    <button id="submit-button">
      <slot></slot>
    </button>
    <input type="checkbox" id="auto-checkbox">`
});

/**
 * Custom HTMLElement for AJAX-submitting to an API.
 * 
 * V2: This should really be handled by a custom form...?
 * V3: The ajax-submit button should really just be the button. 
 *     It should implement a method 'PUT', 'POST', 'GET' or 'DELETE'
 * 
 * @class
 */
export class AjaxSubmit extends HTMLElement {

    static formAssociated = true;
    static supportedMethods = ['GET', 'PUT', 'POST'];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._internals = this.attachInternals();

        this._submitButton = this.shadowRoot.getElementById('submit-button');
        this._autoCheckbox = this.shadowRoot.getElementById('auto-checkbox');

        // Default attribute values
        this._method = 'GET';
        this._auto = 'off';

        // Define custom events
        // QUESTION: Define CustomEvents generally?
        this._dataReadyEvent = new CustomEvent('DataReady', {
            bubbles: true,
            cancelable: false,
            composed: true
        });

        this._statusChangedEvent = new CustomEvent('StatusChanged', {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }

    static get observedAttributes() {
        return ['method', 'auto'];
    }

    // Set js-properties from html-attributes
    attributeChangedCallback(name, oldValue, newValue, DEBUG = true) {
        if (DEBUG) console.log(`<ajax-submit ${name}=${newValue}>`)
        switch (name) {
            case 'method':
                if (AjaxSubmit.supportedMethods.includes(newValue)) {
                    this._method = newValue;
                } else {
                    // DEBUG
                    console.log(`Invalid attribute value of ${newValue} for ${name}, value left unchanged (${oldValue}).`)
                }
                break;

            case 'auto':
                if (newValue == 'on') {
                    this._autoAvailable = true;
                    this._auto = true;
                    this._autoCheckbox.checked = true;
                    this._autoCheckbox.style.visibility = 'visible';
                } else if (newValue == 'off') {
                    this._autoAvailable = true;
                    this._auto = false;
                    this._autoCheckbox.checked = false;
                    this._autoCheckbox.style.visibility = 'visible';
                // } else if (newValue == 'unavailable') {
                } else {
                    this._autoAvailable = false;
                    this._auto = false;
                    this._autoCheckbox.checked = false;
                    this._autoCheckbox.style.visibility = 'hidden';
                }
                break;

            default:
                break;
        }
    }

    connectedCallback() {
        // Set event listeners
        this._submitButton.addEventListener('click', (event) => {
            event.preventDefault(); // required?
            this.submit();
        });

        // Fire automatically on creation if auto=true
        if (this._auto) {
            this.submit();
        }
    }

    // Send current form data to form.action endpoint according to defined method 
    submit() {
        // (currently) supported methods
        const bodyMethods = ['PUT'];

        // use form target
        let target = this._internals.form.action;

        // Define payload skeleton
        // TODO: Include token
        let payload = {
            method: this._method,
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
        }

        // Provide a body only when required
        if (bodyMethods.includes(this._method)) {
            payload['body'] = JSON.stringify(this.gatherPayload());
        }

        fetch(target, payload).then((response) => {
            // Retrieve return payload
            let payload = response.json();

            // Update status
            this.passStatus(`${response.statusText}`);

            return payload;
        }).then((json) => {
            // Update status and data
            switch (this._method) {
                case 'GET':
                    console.log('GET-case')
                    this.passStatus(`Loaded (Last modified: ${json.last_modified})`);
                    this.passData(json);
                    break;

                case 'PUT':
                    console.log('PUT-case')
                    this.setStatus(`Saved (Last modified: ${json.last_modified})`);
                    break;

                default:
                    break;
            }
        }).catch((error) => {
            this.passStatus(error);
        })
    }

    /**
     *  Gather form elements values into key-value object
     */
    gatherPayload() {
        return Object.fromEntries(Array.from(this._internals.form.elements).map((element) => {
            return [element.name, element.value]
        }));
    }

    /* Pass data to parent element via 
    ? define custom event ?
    */
    passData(data) {
        console.log('passData')
        this._dataReadyEvent.payload = data;
        this.dispatchEvent(this._dataReadyEvent);
    }

    passStatus(statusText) {
        console.log(statusText)
    }

}

// Make the "ajax-submit" tag available
customElements.define('ajax-submit', AjaxSubmit)
