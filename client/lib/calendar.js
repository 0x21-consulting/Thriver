
(function (d,w,c,e,m) {
    'use strict';
    
    // Calendar functions
    var calendar = {
        // Current Month and Year
        month : new Date().getMonth(),
        year : new Date().getFullYear(),
        
        // Initiate Calendar
        init : function () {
            var month = d.getElementById('weeks'), week, day,
                previous = d.querySelector('a.previous'), next = d.querySelector('a.next'),
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
            //calendar.populate();
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
    
    // Initialize calendar
    Template.calendar.onRendered(calendar.init);
})(document, window, console, Element, Math);
