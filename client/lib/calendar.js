
(function (d,w,c,e,m) {
    'use strict';
    
    // We'll be using IndexedDB to maintain transactions and settings
    var db = {
        // DB Handler
        handler : null,
        
        // Initialize client-side database
        init : function (callback) {
            var request;
            
            // If the browser can't even support IDB, all in vain
            if (!db.idb) {
                c.warn('IndexedDB not supported.');
                return;
            }
            
            // Open database SafeToSpend, version 1
            request = db.idb.open('SafeToSpend', 1);
            request.addEventListener('error', db.errorHandler); // Handle errors
            request.addEventListener('upgradeneeded', db.upgrade);
            request.addEventListener('success', function () {
                // Assign db reference
                db.handler = request.result;
                // Handle bubbling errors
                db.handler.addEventListener('error', db.errorHandler);
                
                // Execute call-back function
                callback();
            });
        },
                
        // Handle database errors
        errorHandler : function (e) {
            c.error(e);
        },
                
        // Create or upgrade database
        upgrade : function (e) {
            c.debug('upgrading');
            var db = e.target.result,
                incomeStore = db.createObjectStore('income', { autoIncrement : true }),
                expenseStore = db.createObjectStore('expense', { autoIncrement : true });
        },
        
        // IndexedDB Cross-browser support
        idb : w.indexedDB || w.mozIndexedDB || w.webkitIndexedDB || w.msIndexedDB,
        idbt : w.IDBTransaction || w.webkitIDBTransaction || w.msIDBTransaction,
        idbkr : w.IDBKeyRange || w.webkitIDBKeyRange || w.msIDBKeyRange
    },
    
    // Form functions
    form = {
        // Frequency Select case scenarios
        frequency : function () {
            var elems = [], elem, i = 0, j,
                options = this.parentNode.querySelector('.options'),
                submit  = this.parentNode.querySelector('[type="submit"]');
            
            // Clear options just in case element already has content in it
            options.innerHTML = '';
            
            switch (this.value) {
                case '---':
                    submit.disabled = 'true';
                    break;
                case 'once':
                    // When?
                    elems[0] = d.createElement('label');
                    elems[0].innerText = ' on ';
                    elem = d.createElement('input');
                    elem.type = 'date';
                    elem.name = 'cal';
                    elems[0].appendChild(elem);
                    break;
                case 'weekly':
                case 'biweekly':
                    // On which day of the week?
                    elems[0] = d.createElement('label');
                    elems[0].innerText = ' on ';
                    elems[0].appendChild(form.weekday());
                    break;
                case 'bimonthly':
                    // On which dates?
                    elems[0] = d.createElement('label');
                    elems[0].innerText = ' on the ';
                    elems[0].appendChild(form.date('firstDate'));
                    elems[1] = d.createElement('label');
                    elems[1].innerText = ' and ';
                    elems[1].appendChild(form.date('secondDate'));
                    elems[1].innerHTML += ' of every month';
                    break;
                case 'monthly':
                    // When do we expect this amount each month?
                    elems[0] = d.createElement('label');
                    elems[0].innerText = ' on the ';
                    elems[0].appendChild(form.date());
                    break;
                case 'quarterly':
                case 'biannually':
                case 'annually':
                    // When do we expect these amounts? Show calendars
                    elems[0] = d.createElement('label');
                    elems[0].innerText = ' beginning on ';
                    elem = d.createElement('input');
                    elem.type = 'date';
                    elem.name = 'cal';
                    elems[0].appendChild(elem);
                    break;
            }
            
            // Add elements to page
            for (j = elems.length; i < j; ++i) {
                // Every field should be required. If element is a label, make its child required.
                elems[i].nodeName === 'LABEL' ?
                    elems[i].children[0].required = 'true'
                  : elems[i].required = 'true';
                  
                // Add to page
                options.appendChild(elems[i]);
            }
            
            // Enable Add button
            submit.disabled = false; //TODO: this should not be specific
        },
        // Create weekday select element
        weekday : function (name) {
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], i=0, j=days.length,
                select = d.createElement('select'), option;
                
            select.name = name || 'weekday';
            
            for (;i<j;i+=1) {
                option = d.createElement('option');
                option.value = i;
                option.innerText = days[i];
                select.appendChild(option);
            }
            return select;
        },
        // Create date select element
        date : function (name) {
            var dates = ['first','second','third','fourth','fifth','sixth','seventh',
                'eithth','ninth','tenth','eleventh','twelfth','thirteenth','fourteenth',
                'fifteenth','sixteenth','seventeenth','eighteenth','nineteenth','twentieth','twenty-first',
                'twenty-second','twenty-third','twenty-fourth','twenty-fifth','twenty-sixth','twenty-seventh',
                'twenty-eighth','twenty-ninth','thirtieth','thirty-first','last day'],
                i = 0, j = dates.length, select = d.createElement('select'), option;
        
            select.name = name || 'date';
            
            for (;i<j;i+=1) {
                option = d.createElement('option');
                option.value = i;
                option.innerText = dates[i];
                select.appendChild(option);
            }
            return select;
        }
    },
    
    // Finance functions
    finance = {
        // Handle forms
        bind : function () {
            var incomeFrequency = d.forms['addIncome'].frequency,
                expenseFrequency = d.forms['addExpense'].frequency;
            
            incomeFrequency.addEventListener('change', form.frequency);
            expenseFrequency.addEventListener('change', form.frequency);
            d.getElementById('addIncome').onsubmit = finance.add;
            d.getElementById('addExpense').onsubmit = finance.add;
        },
        popup : undefined,
        // popup
        createPopup : function (e) {
            var toggle,
            
            createIncomeForm = function (elem, callback) {
                var form = d.createElement('form');
                form.id = 'addIncome';
                
            },
            createExpenseForm = function (elem, callback) {};
            
            // If popup does not yet exist, create
            if (!finance.popup) {
                finance.popup = d.createElement('section');
                finance.popup.id = 'popup';
                toggle = [d.createElement('button'), d.createElement('button')];
                toggle[0].value = 'Income'; toggle[1].value = 'Expense';
            }
            
        },
        // Add new income or expense
        add : function (e) {
            // Stop form submission
            e.preventDefault();
            
            var method = this.id === 'addIncome'? 'income' : 'expense',
                transaction = db.handler.transaction([method], 'readwrite'),
                store = transaction.objectStore(method), request, data = {},
                form = d.forms[this.id];
            
            // Handle completion
            transaction.addEventListener('complete', function () {
                c.log('Transaction complete.');
            });
            
            // Add data
            // Parse amount to Float (remove $ and comma), then convert to pennies
            // We use pennies because float arithmetic is very inaccurate
            data.amount = parseFloat(form.amount.value.replace(/[\$,]/g,'')) * 100;
            data.tag = form.tag.value;
            data.frequency = form.frequency.value;
            switch (data.frequency) {
                case 'once':
                case 'quarterly':
                case 'biannually':
                case 'annually':
                    // Store a Date Object for these
                    // Use local timezone as identified by browser
                    data.date = new Date(form.cal.value + (new Date()+'').match(/\((.*)\)/)[1]);
                    break;
                case 'weekly':
                case 'biweekly':
                    // We just need to know the weekday here
                    data.weekday = parseInt(form.weekday.value);
                    break;
                case 'bimonthly':
                    // Two dates to store
                    data.firstDate = parseInt(form.firstDate.value) + 1;
                    data.secondDate = parseInt(form.secondDate.value) + 1;
                    break;
                case 'monthly':
                    // Straight-forward, just one date
                    data.date = parseInt(form.date.value) + 1;
                    break;
            }
            c.debug(data);
            // Now add data to Object Store
            request = store.add(data);
            request.addEventListener('success', function() {
                c.log('Income added successfully.');
                // Update Calendar
                calendar.init();
            });
        }
    },
    
    // Total Income and Total Expenses
    totalIncome = 0, totalExpense = 0,
    
    // Calendar functions
    calendar = {
        // Current Month and Year
        month : new Date().getMonth(),
        year : new Date().getFullYear(),
        
        // Initiate Calendar
        init : function () {
            var month = d.getElementById('weeks'), week, day,
                previous = d.querySelector('.previous'), next = d.querySelector('.next'),
                i, count = 0,
                firstDay = new Date(calendar.year, calendar.month).getDay(), // get first day of month
                total = calendar.lastDay(35); // days in month

            // Title Month
            d.querySelector('#calendar h3').innerHTML = calendar.monthName() + ' ' + calendar.year;

            // Clear month
            month.innerHTML = '';

            // Create weeks and days until we hit the last day of the month
            do {
                // Create Week
                week = d.createElement('div');
                week.classList.add('week');
                
                // Create seven days
                for (i = 0; i < 7; ++i) {
                    day = d.createElement('div'); // each day gets a div
                    
                    // If we haven't started counting days, and this is the right day of the week
                    if (i === firstDay && !count) {
                        // Create first day and start counting
                        ++count;
                    }
                    // If we started counting, and we haven't exceed total number of days in month
                    if (count && count <= total) {
                        day.dataset.date = count;
                        ++count;
                    }
                    // Add day to week
                    week.appendChild(day);
                }
                
                // Add week to month
                month.appendChild(week);
            } while (count <= total);
            
            // Assign left and right arrows month changes
            previous.addEventListener('mouseup', calendar.change);
            next.addEventListener('mouseup', calendar.change);
            
            // Now Populate calendar
            calendar.populate();
        },
        
        // Populate calendar with income and expenses
        populate : function () {
            var income = db.handler.transaction('income').objectStore('income'),
                expense = db.handler.transaction('expense').objectStore('expense'),
        
            // Create an element
            createElements = function (type, amount, transaction) {
                // First Element (there's always at least one, so create it right away)
                var elements = [ d.createElement('span') ],
                    i, weeks, conversion,
                    text = '$ ' + amount + ' ' + transaction.tag;
                
                // Add type class and inner text to first element
                elements[0].classList.add(type);
                elements[0].innerHTML = text;
                
                // Modify first element and create more based on frequency
                switch (transaction.frequency) {
                    // Just One element
                    case 'once':
                    case 'annually':
                        // If this transaction happens this month
                        if (transaction.date.getMonth() === calendar.month) {
                            elements[0].dataset.date = calendar.lastDay(transaction.date.getDate());
                        } else {
                            // nothing to add
                            return [];
                        }
                        break;
                    case 'biannually':
                        // Happens twice per year, and we already know first month
                        // Calculate second month
                        conversion = transaction.date.getMonth();
                        conversion = conversion + 6 > 11 ? (conversion + 6) % 12 : conversion + 6;
                        
                        // If either transactions happen this month
                        if (transaction.date.getMonth() === calendar.month || conversion === calendar.month) {
                            elements[0].dataset.date = calendar.lastDay(transaction.date.getDate());
                        } else {
                            // nothing to add
                            return [];
                        }
                        break;
                    case 'quarterly':
                        conversion = transaction.date.getMonth();
                        // Happens four times per year (every three months)
                        for (i = 0; i < 12; i+=3) {
                            // If we got the right month, we're done
                            if (conversion === calendar.month) {
                                elements[0].dataset.date = calendar.lastDay(transaction.date.getDate());
                                break;
                            }
                            // Otherwise, calculate next month to test
                            conversion = conversion + i > 11 ? (conversion + i) % 12 : conversion + i;
                        }
                        // nothing to add
                        return [];
                    case 'monthly':
                        // Always happens every month
                        elements[0].dataset.date = calendar.lastDay(transaction.date); // just a number, not a Date object
                        break;
                    // More than one element
                    case 'bimonthly':
                        // Happens twice per month
                        // Create second element
                        elements[1] = d.createElement('span');
                        elements[1].classList.add(type);
                        elements[1].innerHTML = text;
                        
                        // Assign dates
                        elements[0].dataset.date = calendar.lastDay(transaction.firstDate);
                        elements[1].dataset.date = calendar.lastDay(transaction.secondDate);
                        break;
                    case 'biweekly':
                        // Happens once every two weeks on a specific day
                        weeks = 2;
                        // purposely falling through
                    case 'weekly':
                        // Happens once per week on a specific day
                        // Returns an array containing all dates during month in which it applies
                        // This method overrides first element
                        i = 0;
                        calendar.weekdays(transaction.weekday, weeks || 1).forEach(function (date) {
                            elements[i] = d.createElement('span');
                            elements[i].classList.add(type);
                            elements[i].innerHTML = text;
                            elements[i].dataset.date = date;
                            ++i;
                        });
                        break;
                    default:
                        // Unknown type of transaction, don't return any elements
                        c.warn('Unknown Transaction', transaction);
                        return [];
                }
                
                return elements;
            },
        
            // Parse element sets
            parse = function (event) {
                var cursor = event.target.result, amount, elements,
                    i, j;
                
                if (cursor) {
                    c.debug(cursor.key, ':', cursor.value); //debug
                    
                    // Increment Total Income and Expense
                    cursor.source.name === 'income'?
                        totalIncome += cursor.value.amount
                      : totalExpense += cursor.value.amount;
                      
                    // Convert amount from pennies to dollars
                    amount = String(cursor.value.amount).replace(/^(\d*)(\d{2})$/, '$1.$2'). // Two decimal places
                        replace(/^\.(\d{1})$/, '0.0$1'). // If just one cent place
                        replace(/^\.(.*)/, '0.$1'); // If two cent places
                    
                    // Retrieve array of elements
                    elements = createElements(cursor.source.name, amount, cursor.value);
                    
                    // Add each element to its respective calendar day
                    for (i = 0, j = elements.length; i < j; ++i) {
                        d.querySelector('#calendar [data-date="' + elements[i].dataset.date + '"]').
                            appendChild(elements[i]);
                    }
                    
                    cursor.continue();
                }
            };
            income.openCursor().addEventListener('success', parse);
            expense.openCursor().addEventListener('success', parse);
        },
        
        // Change Month
        change : function () {
            // If moving forward in time
            if (this.classList.contains('next')) {
                // If this is the last month in the year
                if (calendar.month === 11) {
                    calendar.month = 0;
                    ++calendar.year;
                } else {
                    ++calendar.month;
                }
            } else { // Moving backward in time
                // If this is the first month in the year
                if (calendar.month === 0) {
                    calendar.month = 11;
                    --calendar.year;
                } else {
                    --calendar.month;
                }
            }
            
            // Now refresh calendar
            calendar.init();
        },
        
        // Return 31st, 22nd, 23rd, else 14th
        nthDate : function (d) {
            d = d + ''; // In case not a string
            // If number is a teen, always end in th, so don't match them
            return d.match(/[0,2-9]+1$|^1$/)? d+'st'
                 : d.match(/[0,2-9]+2$|^2$/)? d+'nd'
                 : d.match(/[0,2-9]+3$|^3$/)? d+'rd'
                 : d+'th';
        },
                
        // Return the date of the last day of the month
        lastDay : function (d) {
            // Validate whether this date can exist this month
            // Every month can have at least 28 days, so those are all valid
            if (d > 28) {
                // If February
                if (calendar.month === 1) {
                    // If Leap Year
                    // If the year is divisible by 4 AND if the year is divisible by 100 but not by 400, THEN it's a Leap Year
                    if (calendar.year % 4 === 0 && ((calendar.year % 100) === 0 && (calendar.year % 400) !== 0? false : true)) {
                        return 29;
                    }
                    return 28;
                }
                // There can't be more than 30 days in April, June, September, or November
                if (d > 30 && ![3,5,8,10].every(function (val) { return calendar.month !== val; })) {
                    return 30;
                }
                if (d > 31) { // There can't be more than 31 days in a month
                    return 31;
                }
            }
            return d;
        },
        
        // Return the name of the month
        monthName : function (month) {
            var months = [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ];
            month = month || calendar.month;
            return months[month];
        },
        
        // Return array of all dates that fall on a weekday based on number of weeks between
        weekdays : function (day, weeks) {
            var dates = [], date, difference;
            // Calculate next day until we run out of dates
            do {
                // If date doesn't exist, determine first applicable date
                if (!date) {
                    // Do this by calculating the difference between the first day of the month
                    // and the first available week day for the first transaction
                    difference = day - new Date(calendar.year, calendar.month).getDay();
                    date = difference < 0 ? 
                        8 - m.abs(difference) // Start from the same day next week then
                      : difference + 1;       // Otherwise the date is the difference, but count from 1
                }
                dates.push(date); // add date
                date += weeks * 7; // space out x weeks
            } while (date <= calendar.lastDay(35));
            return dates;
        }
    };
    
    // Prototype Functions
    // Insert an element ordered by date
    e.prototype.insert = function (elem) {
        var i = 0, j = elem.length,
        
        iterateSet = function (that, elem) {
            // Get set of elements by which to compare
            var set = that.children, k = 0, l = set.length;
            for (; k < l; k+=1) {
                // If the element's date is prior to or equal
                if (parseInt(set[k].dataset.date) >= parseInt(elem.dataset.date)) {
                    // Insert new elem before current one
                    that.insertBefore(elem, set[k]);
                    // Element is inserted; stop iterating
                    return;
                }
            }
            // Nowhere to insert, so just append to end of list
            that.appendChild(elem);
        };
        
        // Iterate through elements to add
        for (; i < j; i+=1) {
            iterateSet(this, elem[i]);
        }
    };
    
    // Initialize client-side database, then show outlook for this month
    db.init(calendar.init);
    
    // Bind some events
    finance.bind();
})(document, window, console, Element, Math);
