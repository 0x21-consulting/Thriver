import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/*', {
  name: 'App.home',
  action() {
    this.render('canvas');
  },
});
