Template.infosheets.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    tag: 'lc',
    items: () =>
      Thriver.resourceCenter.collection.find({
        type: 'infosheet',
        $or: Thriver.resourceCenter.search.get() instanceof RegExp ? [
          { title: Thriver.resourceCenter.search.get() },
          { publisher: Thriver.resourceCenter.search.get() },
        ] : [{}],
      }, {
        limit: Thriver.resourceCenter.quantity.get(),
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
    tag: 'lc',
    items: () =>
      Thriver.resourceCenter.collection.find({
        type: 'webinar',
        $or: Thriver.resourceCenter.search.get() instanceof RegExp ? [
          { title: Thriver.resourceCenter.search.get() },
          { publisher: Thriver.resourceCenter.search.get() },
        ] : [{}],
      }, {
        limit: Thriver.resourceCenter.quantity.get(),
        sort: { date: -1 },
      }),
  }],
});
