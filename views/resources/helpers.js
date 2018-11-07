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
    type: 'article',
    paginate: 'true',
    perPage: 10,
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
    type: 'catalog',
    paginate: 'true',
    perPage: 10,
    style: 'stripes',
    tag: 'lc', // ?
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
    /*
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
        text: 'Available',
        type: 'transit',
      },
      tags: ['Trauma', 'Fiction'],
    }, {
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
        text: 'Unavailable',
        type: 'transit',
      },
    }],
    */
  }],
});


Template.libraryAddForm.helpers({
  form: {
    status: ['Available', 'Unavailable'],
    materials: [
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
    ],
    classifications: [
      'Resources',
      'Providers',
      'Survivors',
    ],
    keywords: [
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
    ],
  },
});
