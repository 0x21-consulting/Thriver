Template.infosheets.helpers({
    lists: [{
	    type: 'article', //accepts: generic, details, article
	    itemType: 'category',
	    paginate: true, //Default is false
	    perPage: 10, //if paginate:true, how many before paginate (Not currently functioning)
	    style: 'stripes',
	    categories: [{
	        title: 'Summer Webinars',
	        id: 'summerWebinars',
	        items: [{
	            title: 'One Webinar',
	            date: new Date('2016-01-01'), //This is temporary
	            friendlyDate: '02/11/29',
	            content: 'lorem ipsum.',
	            url: 'http://google.com'
	        },{
	            title: 'One Webinar',
	            date: new Date('2016-01-01'), //This is temporary
	            friendlyDate: '02/11/29',
	            content: 'lorem ipsum.',
	            url: 'http://google.com'
	        }]
	    },{
	        title: 'Summer Webinars',
	        id: 'summerWebinars',
	        items: [{
	            title: 'One Webinar',
	            date: new Date('2016-01-01'), //This is temporary
	            friendlyDate: '02/11/29',
	            content: 'lorem ipsum.',
	            url: 'http://google.com'
	        }]
	    }]
	}]
});
