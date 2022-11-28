/**
 * Generates an HTML Element and instantly populates using the options object. 
 * @param: {string} tag     - The HTML Element to be created
 * @param: {object} options - Object containing the properties and values to be assigned to the HTML Element
 */
function tag(tag, options) {
    return Object.assign(document.createElement(tag), options);
}

export { tag };