import { tag } from "./quick-tag";


const template = tag('template', {
    innerHTML: `
    <style>
        .container {
            display: flex;
        }
        .container > * {            
            margin-right: 4px;
        }
        .label {
            background: lightcoral;
            border: 0px;
            padding: 0px 2px 2px 4px;
            margin-right: 4px;
        }
    </style>
    <div class="container">
        <input type="text" id="label-input"/>
        <div id="selected-labels"></div>
    </div>
    `
})

/**
 * Custom HTMLElement containing a LaTeX-customized CodeMirror6 instance.
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
        this._value = '[]';
        this._labels = [];
        this._internals = this.attachInternals();
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

    get value() {
        return this._labels;
        // return this._value;
    }

    set value(val) {
        this._value = JSON.stringify(val);
        this._labels = val
        // console.log(this._value)
        this._renderLabels()
    }

    get form() {
        return this._internals.form;
    }

    get name() {
        return this.getAttribute('name');
    }

    static get observedAttributes() {
        return ['name', 'value'];
    }

    _renderLabels() {
        // Delete old labels first
        Array.from(this._labelContainer.children).forEach((c) => { this._labelContainer.removeChild(c) });
        // Take this._value -> this_labels
        // let labels = JSON.parse(this._value);
        this._labels.forEach((label) => {
            let labelTag = tag('span', { innerHTML: `<b>${label.name} [x]</b>`, classList: ['label'] })
            this._labelContainer.appendChild(labelTag);
            labelTag.addEventListener('click', (event) => {
                this._removeLabel(label.name)
            })
        });
        // console.log("synclabels", this._value);
    }

    _addLabel(value) {
        // let labels = JSON.parse(this._value);
        this._labels.push({ name: value })
        this._value = JSON.stringify(this._labels);
        this._renderLabels()
        // console.log(`add label (${value})`)
    }

    _removeLabel(tagValue) {
        // let labels = JSON.parse(this._value);
        this._labels = this._labels.filter((value, index, array) => {
            return value.name != tagValue;
        })
        this._value = JSON.stringify(this._labels);
        this._renderLabels()
        // console.log(`add label (${value})`)
    }

}

// Make the "latex-editor" tag available
customElements.define('label-selector', LabelSelector)