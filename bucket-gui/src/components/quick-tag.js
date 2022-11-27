function tag(tag, options) {
    return Object.assign(document.createElement(tag), options);
}

export { tag };