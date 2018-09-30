import { Template } from 'meteor/templating';
import History from '/views/history/history';

import './top.html';

// Smooth scroll
Template.top.events({ 'click #back-to-top': History.smoothScrollEventHandler });
