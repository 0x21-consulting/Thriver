// Subscribe to notifications
Meteor.subscribe('notifications');

// Number of notifications
Thriver.notifications.count = new ReactiveVar(0);

// Update page title with notifications count
const updateTitle = () => {
  const title = 'WCASA | Wisconsin Coalition Against Sexual Assault';

  if (Thriver.notifications.count.get() > 0) {
    document.title = `(${Thriver.notifications.count.get()}) - ${title}`;
  } else document.title = title;
};

// Notification helpers
Template.notifications.helpers({
  // Whether to show the notifications section
  show: () => !!Meteor.user(),

  // Return all notifications
  notifications: () => {
    // Notifications from db (manually issued)
    const notifs = Thriver.notifications.collection.find({}).fetch();

    // Ation alerts since last login
    const alerts = Thriver.newsroom.collection
      .find({ date: { $gt: Thriver.lastLogin.get() } }).fetch();

    // Combination
    const all = notifs.concat(alerts);

    // Week
    const week =
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Month
    const month = ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Update total count
    Thriver.notifications.count.set(all.length);

    // Update title
    updateTitle();

    // Normalize datasets
    for (let i = 0; i < all.length; i += 1) {
      // Every notification needs a template
      if (!all[i].template) all[i].template = 'notificationGeneric';

      // Alerts have titles, so assign their text
      if (!all[i].text) all[i].text = all[i].title;

      // Normalize date
      all[i].date = `${week[all[i].date.getDay()]}, ${all[i].date.getDate()} ${month[all[i].date.getMonth()]} \
         ${all[i].date.getFullYear()} \
         ${(all[i].date.getHours() > 12 ? all[i].date.getHours() % 12 : all[i].date.getHours())}\
        :${all[i].date.getMinutes()} \
        ${(all[i].date.getHours() > 11 ? 'pm' : 'am')}`;
    }

    // If no notifications, say so
    if (!all.length) return [{ template: 'notificationEmpty' }];

    return all;
  },
});

Template.notifications.events({
  // Temp UX Alert Notes
  // TODO(eoghantadhg): Clean up
  'click .notificationRenewal button': () => {
    if (window.innerWidth >= 768) {
      $('.overlay').click();
      $('li.donate').click();
    } else {
      // removeOpenAccounts(); not defined
      $('.mobileOverlay').click();
      $('.menuToggle').click();
      $('.mobileMenu li.donate').click();
    }
  },
  'click .notificationApproval > button': (event) => {
    $(event.target).parent().addClass('selected');
  },
  'click .notificationApproval .undo': (event) => {
    $(event.target).parent().parent().removeClass('selected');
  },
  'click section.notifications h2': () => {
    // removeOpenAccounts(); not defined
  },
});
