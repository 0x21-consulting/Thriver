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
        { publisher: Resources.search.get() },
      ] : [{}],
    }, {
      limit: Resources.quantity.get(),
      sort: { date: -1 },
    }),
    */
    items: [{
      title: 'hello',
      byline: 'there pal.',
      callNumber: 'callNum',
      copies: 'Copies',
      subjectHeading: 'something',
      classification: 'somethingClassification',
      category: 'someCat',
      type: 'book',
    }],
  }],
});
