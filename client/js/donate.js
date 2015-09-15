/** 
 * Donate form validation and error handling
 * @method
 *   @param {Element} element - The element to target
 *   @param {string}  message - The message to display to user
 */
var donateException = function (element, message) {
    // Add error state to element
    if (element instanceof Element) {
        element.classList.add('error');
        element.dataset.error = '' + message; // coercion to string
    }
}

// Donate form helpers
Template.donate.helpers({
    'name': function () {
        var user = Meteor.user();
        // Just return name of logged in user
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    },
    'year': function () {
        // Just display this and the next ten years
        var years = [], i,
            thisYear = new Date().getUTCFullYear();
        
        for (i = 0; i < 10; ++i)
            years.push(thisYear + i);
        
        return years;
    }
});

// Donate form events
Template.donate.events({
    // Handle form submission
    'submit .donate-object form': function (event) {
        if (event && event.preventDefault)
            event.preventDefault();
        
        var form = event.target;
        
        Meteor.Paypal.purchase({
            name        : form['name'].value,
            number      : form['number'].value,
            type        : form['type'].value,
            cvv2        : form['cvv2'].value,
            expire_year : form['year'].value,
            expire_month: form['month'].value
        }, {
            total       : form['amount'].value,
            currency    : 'USD'
        }, function (error, results) {
            var i, j, details;
            
            if (error) {
                console.debug('error?', error);
            } else {
                console.debug(results);
                //results contains:
                //  saved (true or false)
                //  if false: "error" contains the reasons for failure
                //  if true: "payment" contains the transaction information
                
                error = results.error;
                if (error && error.response) {
                    // Handle error details
                    if (error.response.details) {
                        details = error.response.details;
                        
                        for (i = 0, j = details.length; i < j; ++i) {
                            switch (details[i].issue) {
                                case 'Invalid expiration (cannot be in the past)':
                                    donateException(form['year'], 
                                        'Expiration cannot be in the past.');
                                    break;
                                case 'Value is invalid':
                                case 'Must be numeric':
                                    switch (details[i].field) {
                                        case 'payer.funding_instruments[0].credit_card.number':
                                            donateException(form['number'], 
                                                'Invalid credit card number.');
                                            break;
                                        case 'payer.funding_instruments[0].credit_card.cvv2':
                                            donateException(form['cvv2'],
                                                'Invalid CVV2 Code.');
                                    }
                                    break;
                            }
                        }
                    }
                    
                    // If there aren't any details, check for other errors
                    switch (error.response.name) {
                        case 'CREDIT_CARD_REFUSED':
                            console.error('Credit Card Refused.');
                            break;
                        default:
                            console.error(error.response.name);
                    }
                }
            }
        });
        
    },
    
    // Show credit card type
    'keyup .donate-object [name="number"]': function (event) {
        if (!event || !event.target)
            return;
        
        var ccImage = event.target.parentElement.parentElement.
                querySelector('.cc-pic'),
            ccType  = event.target.parentElement.parentElement.
                querySelector('.donate-object [name="type"]');
        
        if (!ccImage || !ccType) return;
        
        switch ( event.target.value.substr(0, 2) ) {
            // American Express
            case '34':
            case '37':
                ccImage.textContent = '\uf1f3';
                ccType.value = 'amex';
                break;
            // Diners Club
            case '30': case '36': case '38': case '39':
            case '54': case '55':
                ccImage.textContent = '\uf24c'; break;
            // JCB
            case '35':
                ccImage.textContent = '\uf24b'; break;
            default:
                // Test based on first digit
                switch ( event.target.value.substr(0, 1) ) {
                    // Discover
                    case '6':
                        ccImage.textContent = '\uf1f2';
                        ccType.value = 'discover';
                        break;
                    // Maestro/Mastercard
                    case '5':
                        ccImage.textContent = '\uf1f1';
                        ccType.value = 'mastercard';
                        break;
                    // Visa
                    case '4':
                        ccImage.textContent = '\uf1f0';
                        ccType.value = 'visa';
                        break;
                }
        }
    }
});