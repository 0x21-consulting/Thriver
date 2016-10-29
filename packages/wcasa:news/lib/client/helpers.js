Template.inTheNews.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: () =>
      Thriver.newsroom.collection.find({
        type: 'inTheNews',
        $or: Thriver.newsroom.search.get() instanceof RegExp ? [{
          title: Thriver.newsroom.search.get() }, {
            publisher: Thriver.newsroom.search.get(),
          }] : [{}],
      }, {
        limit: Thriver.newsroom.quantity.get(),
        sort: { date: -1 },
      }),
  }],
});

Template.actionAlerts.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: () => {
      const items = Thriver.newsroom.collection.find({
        type: 'actionAlert',
        $or: Thriver.newsroom.search.get() instanceof RegExp ? [{
          title: Thriver.newsroom.search.get() }, {
            content: Thriver.newsroom.search.get(),
          }] : [{}],
      }, {
        limit: Thriver.newsroom.quantity.get(),
        sort: { date: -1 },
      }).fetch();

      // Dynamically create URL
      for (let i = 0; i < items.length; i += 1) {
        items[i].url = `/action-alert/${Thriver.sections.generateId(items[i].title)}`;
      }

      return items;
    },
  }],
});

Template.press.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: () => {
      const items = Thriver.newsroom.collection.find({
        type: 'pressRelease',
        $or: Thriver.newsroom.search.get() instanceof RegExp ? [{
          title: Thriver.newsroom.search.get() }, {
            content: Thriver.newsroom.search.get(),
          }] : [{}],
      }, {
        limit: Thriver.newsroom.quantity.get(),
        sort: { date: -1 },
      }).fetch();

      // Dynamically create URL
      for (let i = 0; i < items.length; i += 1) {
        items[i].url = `/press-release/${Thriver.sections.generateId(items[i].title)}`;
      }

      return items;
    },
  }],
});

Template.newsletters.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: () =>
      Thriver.newsroom.collection.find({
        type: 'newsletter',
        $or: Thriver.newsroom.search.get() instanceof RegExp ? [{
          title: Thriver.newsroom.search.get() }, {
            content: Thriver.newsroom.search.get(),
          }] : [{}],
      }, {
        limit: Thriver.newsroom.quantity.get(),
        sort: { date: -1 },
      }),
  }],
});

// TODO(micchickenburger): Remove dummy data and connect to db
Template.pressMediaKits.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: [{
      title: 'Press Kit (2015) (PDF)',
      date: new Date('2016-01-01'), // This is temporary
      friendlyDate: '02/11/29',
      icon: 'megaphone',
    }, {
      title: 'Media Kit (2015) (PDF)',
      date: new Date('2016-01-01'), // This is temporary
      friendlyDate: '02/11/29',
      icon: 'camera',
    }],
  }],
});

// TODO(micchickenburger): Remove dummy data and connect to db
Template.annualReports.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    items: [{
      title: 'Annual Report (2015)(PDF)',
      date: new Date('2016-01-01'), // This is temporary
      friendlyDate: '02/11/29',
      icon: 'graph',
    }, {
      title: 'Annual Report (2014)(PDF)',
      date: new Date('2016-01-01'), // This is temporary
      friendlyDate: '02/11/29',
      icon: 'graph',
    }],
  }],
});
