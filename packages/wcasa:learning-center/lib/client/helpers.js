Template.infosheets.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: () =>
      Thriver.learningCenter.collection.find({
        type: 'infosheet',
        $or: Thriver.learningCenter.search.get() instanceof RegExp ? [{
          title: Thriver.learningCenter.search.get() }, {
            publisher: Thriver.learningCenter.search.get(),
          }] : [{}],
      }, {
        limit: Thriver.learningCenter.quantity.get(),
        sort: { date: -1 },
      }),
  }],
});

Template.webinars.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: () =>
      Thriver.learningCenter.collection.find({
        type: 'webinar',
        $or: Thriver.learningCenter.search.get() instanceof RegExp ? [{
          title: Thriver.learningCenter.search.get() }, {
            publisher: Thriver.learningCenter.search.get(),
          }] : [{}],
      }, {
        limit: Thriver.learningCenter.quantity.get(),
        sort: { date: -1 },
      }),
  }],
});
