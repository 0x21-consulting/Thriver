/**
 * Handle ListServ Subscriptions
 * @method
 *   @param {string}  url       - The ListServ URL
 *   @param {string}  email     - The email address to subscribe
 *   @param {boolean} subscribe - True to subscribe, false to unsubscribe
 */
const listServSubscribe = (url, email, subscribe) => {
  check(url, String);
  check(email, String);
  check(subscribe, Boolean);

  // Prepare request
  const xhr = new XMLHttpRequest();
  const form = new FormData();

  // Form details
  if (subscribe) {
    form.append('email', email);
    form.append('pw', 'password');
    form.append('pw-conf', 'password');
  } else {
    form.append('unsub', 'Unsubscribe');
    form.append('unsubconfirm', 1);
  }

  // TODO(micchickenburger): Once XSS concerns are addressed, parse results
  xhr.addEventListener('load', () => {
    //
  });

  // Use proper subscribe/unsubscribe URL
  if (subscribe) xhr.open('POST', `http://lists.wcasa-blog.org/subscribe.cgi/${url}`);
  else xhr.open('POST', `http://lists.wcasa-blog.org/options.cgi/${url}/${email}`);

  xhr.send(form);
};

Template.subscriptions.helpers({
  lists: [{
    heading: 'Email Subscriptions',
    items: [{
      title: 'Press Releases',
      id: 'pressReleasesToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.pressReleases;
        }

        return false;
      },
    }, {
      title: 'Action Alerts',
      id: 'actionAlertsToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.actionAlerts;
        }

        return false;
      },
    }, {
      title: 'Newsletter',
      id: 'newsletterToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.newsletter;
        }

        return false;
      },
    },
        ],
  }, {
    heading: 'Mailing Lists (Listservs)',
    items: [{
      title: 'Expert Witness',
      id: 'expertWitnessToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.expertWitness;
        }

        return false;
      },
    }, {
      title: 'SA Prevention',
      id: 'saPreventionToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.saPrevention;
        }

        return false;
      },
    }, {
      title: 'Survivors & Allies Task Force',
      id: 'saTaskForceToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.saTaskForce;
        }

        return false;
      },
    }, {
      title: 'Sexual Assault Advocates',
      id: 'saAdvocatesToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.saAdvocates;
        }

        return false;
      },
    }, {
      title: 'Campus Sexual Assault',
      id: 'campusSAToggle',
      checked: () => {
        if (Meteor.user() && Meteor.user().profile) {
          return Meteor.user().profile.subscriptions.campusSA;
        }

        return false;
      },
    }],
  }],
});

Template.subscriptions.events({
    /**
     * Subscribe to something
     * @method
     *   @param {$.Event} event - Checked event
     */
  'change #subscriptions input[type="checkbox"]': (event) => {
    check(event, $.Event);

    // Get checkbox info
    const checked = event.target.checked;

    let query;

    switch (event.target.id) {
      case 'pressReleasesToggle':
        query = { 'profile.subscriptions.pressReleases': !!checked }; break;
      case 'actionAlertsToggle':
        query = { 'profile.subscriptions.actionAlerts': !!checked }; break;
      case 'newsletterToggle':
        query = { 'profile.subscriptions.newsletter': !!checked }; break;
      case 'expertWitnessToggle':
        query = { 'profile.subscriptions.expertWitness': !!checked };

        // Initial ListServ subscription
        listServSubscribe('expert-witness-wcasa-blog.org',
          Meteor.user().emails[0].address, !!checked);

        break;
      case 'saPreventionToggle':
        query = { 'profile.subscriptions.saPrevention': !!checked };

        // Initial ListServ subscription
        listServSubscribe('wi-sa-prevention-wcasa-blog.org',
          Meteor.user().emails[0].address, !!checked);

        break;
      case 'saTaskForceToggle':
        query = { 'profile.subscriptions.saTaskForce': !!checked };

        // Initial ListServ subscription
        listServSubscribe('wi-satf-wcasa-blog.org',
          Meteor.user().emails[0].address, !!checked);

        break;
      case 'saAdvocatesToggle':
        query = { 'profile.subscriptions.saAdvocates': !!checked };

        // Initial ListServ subscription
        listServSubscribe('wi-sa-advocates-wcasa-blog.org',
          Meteor.user().emails[0].address, !!checked);

        break;
      case 'campusSAToggle':
        query = { 'profile.subscriptions.campusSA': !!checked };

        // Initial ListServ subscription
        listServSubscribe('campussa-wcasa-blog.org',
          Meteor.user().emails[0].address, !!checked);

        break;
      default: // do nothing
    }

    // Now make the change
    Meteor.users.update({ _id: Meteor.userId() }, { $set: query });
  },
});
