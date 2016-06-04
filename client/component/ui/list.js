//To be deleted. Used as reference for varieties of list data.
var lists =[{
    type: 'article', //accepts: generic, details, article
    itemType: 'category',
    paginate: true, //Default is false
    perPage: 10, //if paginate:true, how many before paginate
    style: 'striped',
    //If standard
    items: {
        title: 'One Webinar',
        date: '06991020', //This is temporary
        friendlyDate: '02/11/29',
        content: 'lorem ipsum.'        
    },
    //If category
    category: {
        title: 'Summer Webinars',
        id: 'summerWebinars',
        items: {
            title: 'One Webinar',
            date: '06991020', //This is temporary
            friendlyDate: '02/11/29',
            content: 'lorem ipsum.'
        }
    },
    //If toggle
    toggle: {
        title: 'Press Releases',
        id: 'pressReleases',
        style: 'striped'
    },
    //If catalog
    catalog: {
        title: 'There is diversity Within Diversity: Community Leaders Views on increasing diversity in youth serving organizations.',
        id: 1,
        byline: 'Sumru Erkut, et al., Center for Research on Women, 1993',
        id: 'summerWebinars',
        callNumber: '6504S',
        copies: 1,
        subjectHeadings: 'Ethnology -- United States. Minority teenagers -- United States -- Societies and clubs.',
        classification: 'Organizational',
        category: 'Organizational Material',
        type: 'Book or Booklet',
        status: {
            type: 'transit',
            style: 'neutral',
            text: 'In Transit',

        }
    }
}];