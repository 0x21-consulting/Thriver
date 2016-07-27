/**
 * @summary Convert markdown into HTML
 * @function
 *   @param {String} text - Text to convert
 * @returns {String}
 */
Template.registerHelper('markdown', function (text) {
    //debug
    if (text === null) return;
    
    // Fail if no text
    check(text, String);
    
    // Convert markdown to html
    text = Marked('' + text);
    
    // Remove <p> tags
    return text.trim().replace(/^<p>/i,'').replace(/<\/p>$/i,'');
});
