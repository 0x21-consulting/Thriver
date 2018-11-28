import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import News from '/logic/news/schema';
import Sections from '/logic/sections/sections';

const selectedType = new ReactiveVar();

Template.inTheNews.helpers({
  lists: [{
    type: 'article', // accepts: generic, details, article, catalog
    paginate: 'true', // Default is false
    perPage: 10, // if paginate:true, how many before paginate
    style: 'stripes',
    tag: 'news',
    items: () => News.collection.find({
      type: 'inTheNews',
      $or: News.search.get() instanceof RegExp ? [
        { title: News.search.get() },
        { publisher: News.search.get() },
      ] : [{}],
    }, {
      limit: News.quantity.get(),
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
    tag: 'news',
    items: () => {
      const items = News.collection.find({
        type: 'actionAlert',
        $or: News.search.get() instanceof RegExp ? [
          { title: News.search.get() },
          { content: News.search.get() },
        ] : [{}],
      }, {
        limit: News.quantity.get(),
        sort: { date: -1 },
      }).fetch();

      // Dynamically create URL
      for (let i = 0; i < items.length; i += 1) {
        items[i].url = `/action-alert/${Sections.generateId(items[i].title)}`;
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
    tag: 'news',
    items: () => {
      const items = News.collection.find({
        type: 'pressRelease',
        $or: News.search.get() instanceof RegExp ? [
          { title: News.search.get() },
          { content: News.search.get() },
        ] : [{}],
      }, {
        limit: News.quantity.get(),
        sort: { date: -1 },
      }).fetch();

      // Dynamically create URL
      for (let i = 0; i < items.length; i += 1) {
        items[i].url = `/press-release/${Sections.generateId(items[i].title)}`;
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
    tag: 'news',
    items: () => News.collection.find({
      type: 'newsletter',
      $or: News.search.get() instanceof RegExp ? [
        { title: News.search.get() },
        { content: News.search.get() },
      ] : [{}],
    }, {
      limit: News.quantity.get(),
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
    tag: 'news',
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
    tag: 'news',
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

// Admin helpers
Template.newsSubHead.helpers({
  types: ['actionAlert', 'inTheNews', 'pressRelease', 'newsletter'],
  inTheNews: () => selectedType.get() === 'inTheNews',
  url: () => selectedType.get() === 'inTheNews' || selectedType.get() === 'newsletter',
  content: () => selectedType.get() === 'pressRelease' || selectedType.get() === 'actionAlert',
});

// Keep track of form type
Template.newsSubHead.events({
  'click #newsForm [name="newsType"]'() {
    selectedType.set(String(this));
  },
});
