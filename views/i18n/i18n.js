import { Template } from 'meteor/templating';

import './i18n.html';

Template.languageSelect.helpers({
  items: [{
    language: 'English',
    id: 'en',
    checked: 'checked',
  }, {
    language: 'Español',
    id: 'es',
  }, {
    language: 'Hmong Daw',
    id: 'hm',
  }, {
    language: 'Pусский',
    id: 'ru',
  }],
});
