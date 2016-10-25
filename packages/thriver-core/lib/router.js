/**
 * @summary Route for Action Alerts
 */
Router.route('action-alert', {
  path: '/action-alert/:title',
  layoutTemplate: 'post',

  /**
   * @summary Wait for subscription
   */
  waitOn: () => Meteor.subscribe('actionAlerts'),

  /**
   * @summary Data to pass to template
   */
  data: () => {
    if (!this.ready()) return undefined;

    let item;
    const items = Thriver.newsroom.collection.find({ type: 'actionAlert' }).fetch();

    // Find the Newsroom item that matches the name
    for (let i = 0; i < items.length; i += 1) {
      if (Thriver.sections.generateId(items[i].title) === this.params.title) {
        item = items[i];
        break;
      }
    }

    // TODO(micchickenburger): Item not found needed here
    if (!item) return undefined;

    // The Post template expects the following additional information:
    item.category = 'Action Alert';
    item.logos = [{
      title: 'WCASA',
      src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
      url: '/',
    }];

    return item;
  },

  /**
   * @summary Render template
   */
  action: () => {
    if (this.ready()) this.render();
  },
});

/**
 * @summary Route for Press Releases
 */
Router.route('press-release', {
  path: '/press-release/:title',
  layoutTemplate: 'post',

  /**
   * @summary Wait for subscription
   */
  waitOn: () => Meteor.subscribe('pressReleases'),

  /**
   * @summary Data to pass to template
   */
  data: () => {
    if (!this.ready()) return undefined;

    let item;
    const items = Thriver.newsroom.collection.find({ type: 'pressRelease' }).fetch();

    // Find the Newsroom item that matches the name
    for (let i = 0; i < items.length; i += 1) {
      if (Thriver.sections.generateId(items[i].title) === this.params.title) {
        item = items[i];
        break;
      }
    }

    // TODO(micchickenburger): Item not found needed here
    if (!item) return undefined;

    // The Post template expects the following additional information:
    item.category = 'Press Release';
    item.logos = [{
      title: 'WCASA',
      src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
      url: '/',
    }];

    return item;
  },

  /**
   * @summary Render template
   */
  action: () => {
    if (this.ready()) this.render();
  },
});

/**
 * @summary Display main canvas template by default
 */
Router.configure({
  layoutTemplate: 'canvas',
});
