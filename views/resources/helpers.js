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
    items: () => Library.collection.find({
      $or: Resources.search.get() instanceof RegExp ? [
        { title: Resources.search.get() },
        { description: Resources.search.get() },
      ] : [{}],
    }, {
      limit: Resources.quantity.get(),
      sort: { date: -1 },
    }),
  }],
});

Template.libraryAddForm.helpers({
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
});

Template.resourceAddForm.helpers({
  types: ['infosheet', 'webinar'],
});


Template.resourceData.helpers({
  title: 'Data',
  subheadText: 'Just how bad of a problem is sexual assault? The reality is that we don’t definitively know; the available data can not begin to paint the complete picture of the scope of the problem. Why? Because most of the numbers we have reflect the number of crimes reported to law enforcement. But, sexual assault is one of those crimes that is still so misunderstood; we know that many victims are not reporting – either because they are ashamed, feel the assault was somehow their fault, are worried about consequences to their perpetrator (who all too often is someone known to the victim and/or an intimate partner), or because they feel that what happened was just “normal” and wasn’t a crime at all.',
  subheadTextStrong: 'In partnership with state agencies and the service providers we represent, WCASA is working toward a more comprehensive picture of sexual violence in Wisconsin.',
  items: [{
    tabs: [{ // If sidebar has tabs: use this property
      title: 'Wisconsin',
      icon: 'user',
      id: 'resourceDataState',
      template: 'resourceDataState',
    }, {
      title: 'National',
      icon: 'cal',
      id: 'resourceDataNational',
      template: 'resourceDataNational',
    }, {
      title: 'Infographics',
      icon: 'none',
      id: 'resourceInfographics',
      template: 'resourceInfographics',
    }],
  }],
});
