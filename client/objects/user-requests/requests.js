Template.requests.helpers({
    heading: function () {
        return 'Library Activity';
    },
    none: function () {
        return 'No activity at this time.';
    },
    statusHeading: function () {
        return 'Status';
    },
    detailsButton: function () {
        return 'Item Details';
    },
    detailsButtonAria: function () {
        return 'View all the details related to this library item';
    },
    moreButton: function () {
        return 'View Library';
    },
    moreButtonAria: function () {
        return 'View enitre Library section';
    },
    items: [{
            title: '"There is diversity Within Diversity": Community Leaders Views on increasing diversity in youth serving organizations.',
            byline: 'Sumru Erkut, et al., Center for Research on Women, 1993',
            id: 'library1025', //Ideally used for moving the focus of the UI to actual library item in learning center.
            status: {
                type: 'good', //accepts: urgent, neutral, good
                message: 'Scheduled to be delivered 12/15.'
            }
        },{
            title: '"There is diversity Within Diversity": Community Leaders Views on increasing diversity in youth serving organizations.',
            byline: 'Sumru Erkut, et al., Center for Research on Women, 1993',
            id: 'library1025',
            status: {
                type: 'good',
                message: 'Scheduled to be delivered 12/15.'
            }
        }
    ],
});