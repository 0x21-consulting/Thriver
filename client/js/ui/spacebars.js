//Spacebars helpers for particular template actions/controls
//Value equals
Template.registerHelper('equals', function (a, b) {
    return a === b;
});

//Value equals or...
Template.registerHelper("equals_or", function(param, arr) {
    arr = arr.split(",");
    if (arr.indexOf(param) !== -1) {
        return true;
    } else {
        return false;
    }
});