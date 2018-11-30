import { Template } from 'meteor/templating';
import { smoothScrollEventHandler } from '/views/history/scroll';

import './top.html';

// Smooth scroll
Template.top.events({ 'click #back-to-top': smoothScrollEventHandler });
