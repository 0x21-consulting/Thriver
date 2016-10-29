Package.describe({
  name: 'thriver:escape',
  version: '0.0.1-teal',
  summary: 'Allows a user to quickly escape the website.',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');
  api.use('ecmascript');
  api.addFiles(['escape.js'], ['client']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:escape');
  // api.mainModule('escape-tests.js');
});
