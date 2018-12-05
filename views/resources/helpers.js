import { Template } from 'meteor/templating';
import Resources from '/logic/resources/schema';
import Library from '/logic/library/schema';

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
    type: 'article',
    paginate: 'true',
    perPage: 10,
    style: 'stripes',
    tag: 'lc',
    yearOnly: true,
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
    type: 'catalog',
    paginate: 'true',
    perPage: 10,
    style: 'stripes',
    tag: 'lc', // ?
    items: () => {
      const query = {};

      if (Resources.search.get() instanceof RegExp) {
        query.$or = [
          { title: Resources.search.get() },
          { description: Resources.search.get() },
        ];
      }

      // Library filters
      if (Resources.material.get()) query.material = Resources.material.get();
      if (Resources.classification.get()) query.classification = Resources.classification.get();
      if (Resources.keywords.get()) query.keywords = Resources.keywords.get();

      return Library.collection.find(query, {
        limit: Resources.quantity.get(),
        sort: { date: -1 },
      });
    },
  }],
});

const status = ['Available', 'Unavailable'];
const materials = [
  'Activities',
  'Books',
  'Curriculum',
  'DVDs',
  'Guide',
  'Handbook',
  'Manual',
  'Report',
  'Study Guide',
  'Textbook',
  'Toolkit',
  'Workbook',
];
const classifications = [
  'Resources',
  'Providers',
  'Survivors',
];
const keywords = [
  'Activism',
  'Advocacy',
  'Based on a True Story',
  'Campus',
  'Child SA',
  'Collected Stories',
  'Counseling',
  'Criminal Justice',
  'Culturally Specific',
  'Disability',
  'Documentary',
  'Evaluation',
  'Fiction',
  'Gender Socialization',
  'Healing',
  'Human Trafficking',
  'Incest',
  'Internet',
  'K-12',
  'Legal',
  'LGBTQ',
  'Medical',
  'Memoirs',
  'Mental Health',
  'Military',
  'Non-profits',
  'Normalization of Violence',
  'Objectification',
  'Offenders',
  'Oppression',
  'Prevention',
  'Prison',
  'Privilege',
  'Self-care',
  'Seniors',
  'Spanish',
  'Spanish with English Subtitles',
  'Substance Abuse',
  'Survivors',
  'Trauma',
  'Treatment',
  'Unhealthy Sexuality',
  'WOC',
];

Template.libraryAddForm.helpers({
  status, materials, classifications, keywords,
});

Template.filterObject.helpers({
  filters: [{
    label: 'Classification',
    name: 'library-classification',
    options: classifications,
  }, {
    label: 'Materials',
    name: 'library-material',
    options: materials,
  }, {
    label: 'Keywords',
    name: 'library-keywords',
    options: keywords,
    multiple: 'multiple',
  }],
});

Template.resourceAddForm.helpers({
  types: ['infosheet', 'webinar'],
});


Template.resourceData.helpers({
  title: 'Data',
  items: [{
    tabs: [{
      isFirst: true,
      title: 'Overview',
      icon: 'user',
      id: 'resourceDataOverview',
      template: 'resourceDataOverview',
      noFilter: true,
    }, {
      title: 'Infographics',
      icon: 'none',
      id: 'resourceInfographics',
      template: 'resourceInfographics',
      noFilter: true,
    }, {
      title: 'Wisconsin',
      icon: 'user',
      id: 'resourceDataState',
      template: 'resourceDataState',
      noFilter: true,
    }, {
      title: 'National',
      icon: 'cal',
      id: 'resourceDataNational',
      template: 'resourceDataNational',
      noFilter: true,
    }],
  }],
});
