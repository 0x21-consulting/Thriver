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

/**
 * @summary Produce a Friendly Date string
 * @function
 *   @param {Date} date
 * @returns {String}
 */
Template.registerHelper('friendlyDate', (date) => {
    // If string, convert to date
    if ( !(date instanceof Date) )
        date = new Date(date);

    check(date, Date);

    var days   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday'],
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December'];

    // Create friendly date string
    return days[date.getDay()] + ', ' + date.getDate() + ' ' +
        months[date.getMonth()] + ' ' + date.getFullYear();
});

/**
 * @summary Produce a Date ISOString
 * @function
 *   @param {Date} date
 * @returns {String}
 */
 Template.registerHelper('ISODate', (date) => {
    // If string, convert to date
    if ( !(date instanceof Date) )
        date = new Date(date);

    check(date, Date);

    return date.toISOString();
});


// debug
Template.registerHelper('debug', function (stuff) {
    console.debug(stuff);
});
