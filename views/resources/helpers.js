import { Template } from 'meteor/templating';
import Resources from '/logic/resources/schema';

Template.infosheets.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    tag: 'lc',
    items: () => Resources.collection.find({
      type: 'infosheet',
      $or: Resources.search.get() instanceof RegExp ? [
        { title: Resources.search.get() },
        { publisher: Resources.search.get() },
      ] : [{}],
    }, {
      limit: Resources.quantity.get(),
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
    items: () => Resources.collection.find({
      type: 'webinar',
      $or: Resources.search.get() instanceof RegExp ? [
        { title: Resources.search.get() },
        { publisher: Resources.search.get() },
      ] : [{}],
    }, {
      limit: Resources.quantity.get(),
      sort: { date: -1 },
    }),
  }],
});

Template.library.helpers({
  lists: [{
    type: 'catalog', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    tag: 'lc',
    /*
    items: () => Resources.collection.find({
      type: 'library',
      $or: Resources.search.get() instanceof RegExp ? [
        { title: Resources.search.get() },
        { description: Resources.search.get() },
        { description: Resources.search.get() },
      ] : [{}],
    }, {
      limit: Resources.quantity.get(),
      sort: { date: -1 },
    }),
    */
    items: [{
      title: 'Stories from a Certain Book About John Doe',
      description: 'Learn about something or other. with a fully detailed something along the lines of several many things. Such as stuff and junk amongst much more valuable things. Considerations and nonsense may apply.',
      descriptionTrunc: 'Learn about something or other. with a fully detailed something along the lines of several many things. Such as stuff and junk amongst much more valuable things. Considerations...',
      callNumber: 534827834727,
      copies: 12,
      subjectHeading: 'Some Headings',
      classification: 'Providers',
      category: 'Resource',
      type: 'book',
      status: {
        text: 'get it',
        type: 'transit',
      },
    }],
  }],
});
