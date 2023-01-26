import { tag } from "./quick-tag";


const template = tag('template', {}, {
    innerHTML: `
    <style>
        :host {
            display: flex;    
        }
        * {
            box-sizing: border-box;
        }
        .label {
            background: violet;
            border: 0px;
            padding: 0px 2px 2px 4px;
            margin-right: 4px;
        }
        .container {
            display: flex;
        }
    </style>
    <div class="container">
        <input type="text" id="label-input"/>
        <div id="selected-labels"></div>
    </div>
    `
})


// TODO: Document
/**
 * Custom HTMLElement for defineing labels.
 * 
 * @class
 */
export class LabelSelector extends HTMLElement {

    // Make LatexEditor form-associated
    static formAssociated = true;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._labelContainer = this.shadowRoot.getElementById('selected-labels');
        this._labelInput = this.shadowRoot.getElementById('label-input');
        this._internals = this.attachInternals();

        this._labels = [];
    }

    connectedCallback() {
        this._labelInput.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.key == 'Enter') {
                console.log(event.key);
                this._addLabel(this._labelInput.value)
                this._labelInput.value = ''
            }
        });
        this._labelInput.addEventListener('keydown', (event) => {
            if (event.key == 'Tab') {
                event.preventDefault();
                this._addLabel(this._labelInput.value)
                this._labelInput.value = ''
            }
        });
    }

    // Getters and Setters
    // NOTE: Autofilling this object requires a name,value-pair for the object where the value-setter handles the fill
    get value() {
        return this._labels;
    }

    set value(val) {
        this._labels = val
        this._renderLabels()
    }

    get name() {
        // BUG? Attribute may be changed, save as property?
        return this.getAttribute('name');
    }

    _renderLabels() {
        // Delete old labels first
        Array.from(this._labelContainer.children).forEach((c) => { this._labelContainer.removeChild(c) });

        // Add all labels from this._labels into container
        this._labels.forEach((labelName) => {
            let labelTag = tag('span', {}, { innerHTML: `<b>${labelName} [x]</b>`, classList: ['label'] })
            this._labelContainer.appendChild(labelTag);

            // Event listener for removal (need to append first!)
            labelTag.addEventListener('click', (event) => {
                this._removeLabel(labelName)
            })
        });
    }

    _addLabel(value) {
        this._labels.push(value)
        this._renderLabels()
    }

    _removeLabel(tagValue) {
        this._labels = this._labels.filter((value, index, array) => {
            return value.name != tagValue;
        })
        this._renderLabels()
    }

}

// Make the "label-selector" tag available
customElements.define('label-selector', LabelSelector)