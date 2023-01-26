/**
 * Generates an HTML Element and instantly populates using the attributes object. 
 * @param: {string} tag        - tagname of HTML Element to be created
 * @param: {object} attributes - Object containing the attributes and values to be assigned to the HTML Tag Element
 * @param: {object} properties - Object containing the properties and values to be assigned to the HTML DOM Element
 */
function tag(tag, attributes, properties) {
    let t = document.createElement(tag);
    Object.entries(attributes).forEach(entry => {
        // console.log(entry)
        t.setAttribute(entry[0], entry[1]);
    });
    Object.assign(t, properties);
    return t;
}

export { tag };