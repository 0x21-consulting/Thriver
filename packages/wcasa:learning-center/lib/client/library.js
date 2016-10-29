Template.library.helpers({
  lists: [{
    type: 'catalog', // accepts: generic, details, article
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
  // If catalog
    items: [{
      title: 'There is diversity Within Diversity: Community Leaders Views on increasing diversity in youth serving organizations.',
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
      },
    }, {
      title: 'There is diversity Within Diversity: Community Leaders Views on increasing diversity in youth serving organizations.',
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
      },
    }],
  }],
});
