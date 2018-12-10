import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Meteor } from 'meteor/meteor';

/**
 * @summary Action Alerts Route
 */
FlowRouter.route('/action-alert/:title', {
  name: 'App.actionAlerts',
  waitOn: params => Meteor.subscribe('actionAlert', params.title),
  action(params) {
    this.render('post', {
      category: 'Action Alert',
      logos: [{
        title: 'WCASA',
        src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
        url: '/',
      }],
      friendlyTitle: params.title,
    });
  },
});

/**
 * @summary Press Releases Route
 */
FlowRouter.route('/press-release/:title', {
  name: 'App.pressReleases',
  waitOn: params => Meteor.subscribe('pressRelease', params.title),
  action(params) {
    this.render('post', {
      category: 'Press Release',
      logos: [{
        title: 'WCASA',
        src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
        url: '/',
      }],
      friendlyTitle: params.title,
    });
  },
});

/**
 * @summary Receipts route
 */
FlowRouter.route('/receipt/:id', {
  name: 'App.receipts',
  waitOn: params => Meteor.subscribe('receipt', params.id),
  action() {
    this.render('receipt');
  },
});

/**
 * @summary Default route
 */
FlowRouter.route('/*', {
  name: 'App.home',
  action() {
    this.render('canvas');
  },
});

/**
 * @summary 301 Page Redirects
 */
FlowRouter.route('/pages/Home-Page.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/About-Us.php', { action() { this.render('canvas'); History.navigate('/who-we-are'); } });
FlowRouter.route('/pages/About-Us_Vision-Mission-&-Philosophy.php', { action() { this.render('canvas'); History.navigate('/who-we-are/vision-mission-philosophies'); } });
FlowRouter.route('/pages/About-Us_Sexual-Violence.php', { action() { this.render('canvas'); History.navigate('/what-we-do'); } });
FlowRouter.route('/pages/About-Us_Staff.php', { action() { this.render('canvas'); History.navigate('/who-we-are/wcasa-staff'); } });
FlowRouter.route('/pages/About-Us_Internships.php', { action() { this.render('canvas'); History.navigate('/get-involved/intern'); } });
FlowRouter.route('/pages/About-Us_Board.php', { action() { this.render('canvas'); History.navigate('/who-we-are/board-of-directors'); } });
FlowRouter.route('/pages/Contact.php', { action() { this.render('canvas'); History.navigate('/contact'); } });
FlowRouter.route('/pages/ALL.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression'); } });
FlowRouter.route('/pages/ALL-RACE-ETHNICITY.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/race-ethnicity'); } });
FlowRouter.route('/pages/ALL-GENDER-Transgender.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/lgbtq'); } });
FlowRouter.route('/pages/ALL-SEXUAL_ORIENTATION.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/lgbtq'); } });
FlowRouter.route('/pages/ALL-SEXUAL_ORIENTATION-LGBTQCommittee.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/lgbtq'); } });
FlowRouter.route('/pages/ALL-AGE_ABILITY.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/disability'); } });
FlowRouter.route('/pages/ALL-AGE_ABILITY-Deaf.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/deaf'); } });
FlowRouter.route('/pages/Data-Wisconsin.php', { action() { this.render('canvas'); History.navigate('/resource-center/data'); } });
FlowRouter.route('/pages/Data-National.php', { action() { this.render('canvas'); History.navigate('/resource-center/data'); } });
FlowRouter.route('/pages/Intervention_Advocacy.php', { action() { this.render('canvas'); History.navigate('/what-we-do/advocacy'); } });
FlowRouter.route('/pages/Intervention_Human-Trafficking.php', { action() { this.render('canvas'); History.navigate('/what-we-do/advocacy/sexual-assault-victim-advocacy-school'); } });
FlowRouter.route('/pages/Intervention_SurvivorsAndAlliesTaskForce.php', { action() { this.render('canvas'); History.navigate('/what-we-do/survivors-allies'); } });
FlowRouter.route('/pages/Donate.php', { action() { this.render('canvas'); History.navigate('/donate/'); } });
