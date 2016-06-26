//The only reason all these data-contexts are in the same file is for the date to work.
//@mcchickenburger: consider globalizing date function

/**
 * Produce a Friendly Date string
 * @function
 *   @param {Collection} this
 * @returns {string}
 */
friendlyDate = function () {
    var date   = new Date(this.date),
        days   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday'],
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December'];

    // Create friendly date string
    return days[date.getDay()] + ', ' + date.getDate() + ' ' +
        months[date.getMonth()] + ' ' + date.getFullYear();
};

function removeActiveClass(){
    $('.newsContent li').removeClass('active');
    $('.newsTabs li').removeClass('active');
}



Template.inTheNews.helpers({
    lists: [{
        type: 'article', //accepts: generic, details, article, catalog
        paginate: 'true', //Default is false
        perPage: 10, //if paginate:true, how many before paginate
        style: 'stripes',
        items: function () {
            return Newsroom.find({
                type: 'inTheNews',
                $or: search.get() instanceof RegExp ? [{
                    title: search.get() },{
                    publisher: search.get()
                }] : [{}]
            }, {
                limit: quantity.get(),
                sort: { date: -1 }
            });
        },
        friendlyDate: friendlyDate
    }]
});

Template.actionAlerts.helpers({
    lists: [{
        type: 'article', //accepts: generic, details, article, catalog
        paginate: 'true', //Default is false
        perPage: 10, //if paginate:true, how many before paginate
        style: 'stripes',
        items: function () {
            return Newsroom.find({
                type: 'actionAlert',
                $or: search.get() instanceof RegExp ? [{
                    title: search.get() },{
                    content: search.get()
                }] : [{}]
            }, {
                limit: quantity.get(),
                sort: { date: -1 }
            });
        },
        friendlyDate: friendlyDate
    }]
});

Template.press.helpers({
    lists: [{
        type: 'article', //accepts: generic, details, article, catalog
        paginate: 'true', //Default is false
        perPage: 10, //if paginate:true, how many before paginate
        style: 'stripes',
        items: function () {
            return Newsroom.find({
                type: 'pressRelease',
                $or: search.get() instanceof RegExp ? [{
                    title: search.get() },{
                    content: search.get()
                }] : [{}]
            }, {
                limit: quantity.get(),
                sort: { date: -1 }
            });
        },
        friendlyDate: friendlyDate
    }]
});

Template.newsletters.helpers({
    lists: [{
        type: 'article', //accepts: generic, details, article, catalog
        paginate: 'true', //Default is false
        perPage: 10, //if paginate:true, how many before paginate
        style: 'striped',
        items: [{
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.'
        },{
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.'
        }],
    }]
});

Template.pressMediaKits.helpers({
    lists: [{
        type: 'article', //accepts: generic, details, article, catalog
        paginate: 'true', //Default is false
        perPage: 10, //if paginate:true, how many before paginate
        style: 'stripes',
        items: [{
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.',
            icon: 'graph'
        },{
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.',
            icon: 'graph'
        }],
    }]
});

Template.annualReports.helpers({
    lists: [{
        type: 'article', //accepts: generic, details, article, catalog
        paginate: 'true', //Default is false
        perPage: 10, //if paginate:true, how many before paginate
        style: 'stripes',
        items: [{
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.'
        },{
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.'
        }],
    }]
});
