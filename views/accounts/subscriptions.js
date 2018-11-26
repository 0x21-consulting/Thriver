import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Toast from '/views/components/toasts';

import './subscriptions.html';

/**
 * Handle ListServ Subscriptions
 * @method
 *   @param {string}  url       - The ListServ URL
 *   @param {string}  email     - The email address to subscribe
 *   @param {boolean} subscribe - True to subscribe, false to unsubscribe
 */
const listServSubscribe = (url, email, subscribe) => {
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
    }],
  }, {
    heading: 'Mailing Lists (Listservs)',
    items: [{
      title: 'Expert Witness',
      description: 'Advocates and other service provider staff to solicit expert witnesses and for professionals to offer themselves as expert witnesses.',
      id: 'expertWitnessToggle',
      url: 'http://lists.wcasa-blog.org/listinfo.cgi/expert-witness-wcasa-blog.org',
    }, {
      title: 'SA Prevention',
      description: 'Share resources with Sexual assault prevention staff.',
      id: 'saPreventionToggle',
      url: 'http://lists.wcasa-blog.org/listinfo.cgi/wi-sa-prevention-wcasa-blog.org',
    }, {
      title: 'Survivors & Allies Task Force',
      description: 'Focused on survivors and their allies, meant as a space to suggest activities, share insights and resources, and support survivors.',
      id: 'saTaskForceToggle',
      url: 'http://lists.wcasa-blog.org/listinfo.cgi/wi-satf-wcasa-blog.org',
    }, {
      title: 'Sexual Assault Advocates',
      description: 'Sexual assault advocates across the state can share resources and ask questions.',
      id: 'saAdvocatesToggle',
      url: 'http://lists.wcasa-blog.org/listinfo.cgi/wi-sa-advocates-wcasa-blog.org',
    }, {
      title: 'Campus Sexual Assault',
      description: 'Specifically for staff and those associated with the campus sexual assault field.',
      id: 'campusSAToggle',
      url: 'http://lists.wcasa-blog.org/listinfo.cgi/campussa-wcasa-blog.org',
    }],
  }, {
    heading: 'Regional Mailing Lists (Listservs)',
    items: [{
      title: 'Southwest Region',
      description: 'Adams, Crawford, Grant, Iowa, Juneau, La Crosse, Lafayette, Monroe, Richland, Sauk, Vernon',
      id: 'listServSWRegion',
      url: 'http://lists.wcasa-blog.org/admin.cgi/regional_ta_sw-wcasa-blog.org',
    }, {
      title: 'South Central Region',
      description: 'Columbia, Dane, Dodge, Green, Jefferson, Rock, Walworth',
      id: 'listservSCRegion',
      url: 'http://lists.wcasa-blog.org/admin.cgi/regional_ta_sc-wcasa-blog.org',
    }, {
      title: 'Southeast Region',
      description: 'Kenosha, Milwaukee, Ozaukee, Racine, Washington, Waukesha',
      id: 'listservSERegion',
      url: 'http://lists.wcasa-blog.org/admin.cgi/regional_ta_se-wcasa-blog.org',
    }, {
      title: 'Northwest Region',
      description: 'Ashland, Barron, Bayfield, Buffalo, Burnett, Chippewa, Clark, Douglas, Dunn, Eau Claire, Jackson, Pepin, Pierce, Polk, Rusk, Sawyer, St. Croix, Trempealeau, Washburn',
      id: 'listservNWRegion',
      url: 'mailto:wcasa@wcasa.org?subject=Subscribe%20me%20to%20the%20Northwest%20Regional%20Listserv',
    }, {
      title: 'North Central Region',
      description: 'Florence, Forest, Iron, Langlade, Lincoln, Marathon, Oneida, Portage, Price, Taylor, Vilas, Wood',
      id: 'liserservNCRegion',
      url: 'mailto:wcasa@wcasa.org?subject=Subscribe%20me%20to%20the%20North%20Central%20Regional%20Listserv',
    }, {
      title: 'Northeast Region',
      description: 'Brown, Calumet, Door, Fond du Lac, Green Lake, Kewaunee, Manitowoc, Marinette, Marquette, Menominee, Oconto, Outagamie, Shawano, Sheboygan, Waupaca, Waushara, Winnebago',
      id: 'listservNERegion',
      url: 'http://lists.wcasa-blog.org/admin.cgi/regional_ta_ne-wcasa-blog.org',
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
    // Get checkbox info
    const { checked } = event.target;

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
        listServSubscribe(
          'expert-witness-wcasa-blog.org',
          Meteor.user().emails[0].address,
          !!checked,
        );

        break;
      case 'saPreventionToggle':
        query = { 'profile.subscriptions.saPrevention': !!checked };

        // Initial ListServ subscription
        listServSubscribe(
          'wi-sa-prevention-wcasa-blog.org',
          Meteor.user().emails[0].address,
          !!checked,
        );

        break;
      case 'saTaskForceToggle':
        query = { 'profile.subscriptions.saTaskForce': !!checked };

        // Initial ListServ subscription
        listServSubscribe(
          'wi-satf-wcasa-blog.org',
          Meteor.user().emails[0].address,
          !!checked,
        );

        break;
      case 'saAdvocatesToggle':
        query = { 'profile.subscriptions.saAdvocates': !!checked };

        // Initial ListServ subscription
        listServSubscribe(
          'wi-sa-advocates-wcasa-blog.org',
          Meteor.user().emails[0].address,
          !!checked,
        );

        break;
      case 'campusSAToggle':
        query = { 'profile.subscriptions.campusSA': !!checked };

        // Initial ListServ subscription
        listServSubscribe(
          'campussa-wcasa-blog.org',
          Meteor.user().emails[0].address,
          !!checked,
        );

        break;
      default: // do nothing
    }

    // Now make the change
    Meteor.users.update({ _id: Meteor.userId() }, { $set: query });

    // Alert the User
    if (document.querySelectorAll('.subscriptions-update-toast').length < 1) {
      // Alert the user.
      Toast({ text: 'Your subscriptions have been updated.', classes: 'subscriptions-update-toast', duration: 3000 });
    }
  },
});
