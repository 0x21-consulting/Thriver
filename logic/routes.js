import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Meteor } from 'meteor/meteor';
import History from '/views/history/history';

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
 * @summary 301 Page Redirects
 */
FlowRouter.route('/pages/Home-Page.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/About-Us.php', { action() { this.render('canvas'); History.navigate('/who-we-are'); } });
FlowRouter.route('/pages/About-Us_Vision-Mission-&-Philosophy.php', { action() { this.render('canvas'); History.navigate('/who-we-are/vision-mission-philosophies'); } });
FlowRouter.route('/pages/About-Us_Sexual-Violence.php', { action() { this.render('canvas'); History.navigate('/what-we-do'); } });
FlowRouter.route('/pages/About-Us_Staff.php', { action() { this.render('canvas'); History.navigate('/who-we-are/wcasa-staff'); } });
FlowRouter.route('/pages/About-Us_Internships.php', { action() { this.render('canvas'); History.navigate('/get-involved/intern'); } });
FlowRouter.route('/pages/About-Us_Board.php', { action() { this.render('canvas'); History.navigate('/who-we-are/board-of-directors'); } });
FlowRouter.route('/pages/About-Us_Annual-Reports.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Contact.php', { action() { this.render('canvas'); History.navigate('/contact'); } });
FlowRouter.route('/pages/ALL.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression'); } });
FlowRouter.route('/pages/ALL-RACE-ETHNICITY.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/race-ethnicity'); } });
FlowRouter.route('/pages/ALL-RACE-ETHNICITY_African-American.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-RACE-ETHNICITY_Latina-Latino.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-RACE-ETHNICITY_Native-American.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-GENDER.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-GENDER-Transgender.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/lgbtq'); } });
FlowRouter.route('/pages/ALL-GENDER-Female.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-GENDER-Male.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-SEXUAL_ORIENTATION.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/lgbtq'); } });
FlowRouter.route('/pages/ALL-SEXUAL_ORIENTATION-LGBTQCommittee.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/lgbtq'); } });
FlowRouter.route('/pages/ALL-AGE_ABILITY.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/disability'); } });
FlowRouter.route('/pages/ALL-AGE_ABILITY-Deaf.php', { action() { this.render('canvas'); History.navigate('/what-we-do/anti-oppression/deaf'); } });
FlowRouter.route('/pages/ALL-CLASS_CULTURE.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/ALL-CLASS_CULTURE-Military.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Data-Wisconsin.php', { action() { this.render('canvas'); History.navigate('/resource-center/data'); } });
FlowRouter.route('/pages/Data-National.php', { action() { this.render('canvas'); History.navigate('/resource-center/data'); } });
FlowRouter.route('/pages/Intervention.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Intervention_Advocacy.php', { action() { this.render('canvas'); History.navigate('/what-we-do/advocacy'); } });
FlowRouter.route('/pages/Intervention_CCR.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Intervention_Human-Trafficking.php', { action() { this.render('canvas'); History.navigate('/what-we-do/advocacy/sexual-assault-victim-advocacy-school'); } });
FlowRouter.route('/pages/Prison-Rape-Elimination-Act-(PREA).php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Intervention_SurvivorsAndAlliesTaskForce.php', { action() { this.render('canvas'); History.navigate('/what-we-do/survivors-allies'); } });
FlowRouter.route('/pages/Intervention_SANE.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Intervention_SART.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Events_SAVAS.php', { action() { this.render('canvas'); History.navigate('/events'); } });
FlowRouter.route('/pages/Prevention.php', { action() { this.render('canvas'); History.navigate('/what-we-do/prevention'); } });
FlowRouter.route('/pages/Prevention-Framework.php', { action() { this.render('canvas'); History.navigate('/what-we-do/prevention/framework'); } });
FlowRouter.route('/pages/Prevention-Engagement.php', { action() { this.render('canvas'); History.navigate('/what-we-do/prevention/engagement'); } });
FlowRouter.route('/pages/PreventionBestPractice.php', { action() { this.render('canvas'); History.navigate('/what-we-do/prevention/best-practice'); } });
FlowRouter.route('/pages/Campus.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Evaluation.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin---Program-Evaluation-101.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin---Evaluation-vs-Research.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin-Cultural-Competency.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin-Useful-Evaluation-Approaches-in-SV.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin-Useful-Evaluation-Approaches-in-SV-Empowerment-Evaluation.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin-Useful-Evaluation-Approaches-in-SV-Feminist-Evaluation.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin-Protecting-Human-Subjects.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Before-You-Begin-Evidence-Based-Practice.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/before-you-begin'); } });
FlowRouter.route('/pages/Evaluation-Planning-It-Out.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/plan-it-out'); } });
FlowRouter.route('/pages/Evaluation-Planning-It-Out-Engaging-Stakeholders.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/plan-it-out'); } });
FlowRouter.route('/pages/Evaluation-Planning-It-Out-Logic-Models.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/plan-it-out'); } });
FlowRouter.route('/pages/Evaluation-Planning-It-Out-Objectives.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/plan-it-out'); } });
FlowRouter.route('/pages/Evaluation-Planning-It-Out-Objectives-Percent-Change.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/plan-it-out'); } });
FlowRouter.route('/pages/Evaluation-Planning-It-Out-Evaluation-Questions.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/plan-it-out'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures-Indicators.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures-Standardized-Measures.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures-Measure-Database.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures-Measure-Database-Advocacy-Tools.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures-Measure-Database-Prevention-Tools.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-Indicators-and-Measures-Measure-Database-Others.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-indicators'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Plans.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Design.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Design-Surveys.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Design-Interviews-&-Focus-Groups.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Design-Observations.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Design-Document-Review.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Selecting-the-Design-Evaluation-Design-Activity-Focused.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/select-the-design'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Database-Creation.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Database-Creation-Excel.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Database-Creation-Epi-Info.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Database-Creation-Surveymonkey.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Analyzing-Results.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Analyzing-Results-Quantitative.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Dealing-with-Data-Analyzing-Results-Qualitative.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/deal-with-data'); } });
FlowRouter.route('/pages/Evaluation-Using-Results.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/use-results'); } });
FlowRouter.route('/pages/Evaluation-Using-Results-Presenting-Findings.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/use-results'); } });
FlowRouter.route('/pages/Evaluation-Using-Results-Writing-Reports.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/use-results'); } });
FlowRouter.route('/pages/Evaluation-Using-Results-Program-Improvement.php', { action() { this.render('canvas'); History.navigate('/what-we-do/evaluation/use-results'); } });
FlowRouter.route('/pages/Events.php', { action() { this.render('canvas'); History.navigate('/events'); } });
FlowRouter.route('/pages/Resources-Webinars.php', { action() { this.render('canvas'); History.navigate('/resource-center/webinars'); } });
FlowRouter.route('/pages/Events-State.php', { action() { this.render('canvas'); History.navigate('/events'); } });
FlowRouter.route('/pages/Events-National.php', { action() { this.render('canvas'); History.navigate('/events'); } });
FlowRouter.route('/pages/Resources.php', { action() { this.render('canvas'); History.navigate('/resource-center/infosheets'); } });
FlowRouter.route('/pages/SASPs.php', { action() { this.render('canvas'); History.navigate('/get-involved/sasp-membership'); } });
FlowRouter.route('/pages/Events-Regional-TA-Trainings.php', { action() { this.render('canvas'); History.navigate('/events'); } });
FlowRouter.route('/pages/Resources-Info_Sheets.php', { action() { this.render('canvas'); History.navigate('/resource-center/infosheets'); } });
FlowRouter.route('/pages/Resources-Resource_Center.php', { action() { this.render('canvas'); History.navigate('/resource-center/infosheets'); } });
FlowRouter.route('/pages/Resources-Webinars.php', { action() { this.render('canvas'); History.navigate('/resource-center/webinars'); } });
FlowRouter.route('/pages/listservs.php', { action() { this.render('canvas'); History.navigate('/register'); } });
FlowRouter.route('/pages/Resources-Jobs.php', { action() { this.render('canvas'); History.navigate('/get-involved/jobs'); } });
FlowRouter.route('/pages/Policy-&-Law.php', { action() { this.render('canvas'); History.navigate('/what-we-do/policy-law'); } });
FlowRouter.route('/pages/Policy-Federal.php', { action() { this.render('canvas'); History.navigate('/what-we-do/policy-law/federal-policy'); } });
FlowRouter.route('/pages/Policy-State.php', { action() { this.render('canvas'); History.navigate('/what-we-do/policy-law/state-policy'); } });
FlowRouter.route('/pages/Media.php', { action() { this.render('canvas'); History.navigate('/news/in-the-news'); } });
FlowRouter.route('/pages/Media-Press_Releases.php', { action() { this.render('canvas'); History.navigate('/news/in-the-news'); } });
FlowRouter.route('/pages/Policy-Action-Alerts-&-Updates.php', { action() { this.render('canvas'); History.navigate('/news/action-alerts'); } });
FlowRouter.route('/pages/Media-Media_Toolkits.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Media-MediaOutlet-Toolkit.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Media-SA-Agency-Toolkit.php', { action() { this.render('canvas'); History.navigate('/'); } });
FlowRouter.route('/pages/Media-Social_Media.php', { action() { this.render('canvas'); History.navigate('/twitter'); } });
FlowRouter.route('/pages/en-Espanol.php', { action() { this.render('canvas'); History.navigate('/espanol/servicios-bilinges'); } });
FlowRouter.route('/pages/Members.php', { action() { this.render('canvas'); History.navigate('/get-involved/sasp-membership'); } });

/**
 * @summary Default route
 */
FlowRouter.route('/*', {
  name: 'App.home',
  action() {
    this.render('canvas');
  },
});
