Package.describe({
  name: 'wcasa:contact',
  version: '0.0.1-teal',
  summary: 'Contact Section for the WCASA Implementation of Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  // Dependencies
  api.use([
    'thriver:core',
    'thriver:core-styles',
  ]);

  // Resources
  api.addAssets([

  ], ['client']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/contact.html',

    // Styles
    'lib/templates/contact.less',

    // Helpers and methods
    'lib/client/contact.js',
  ], ['client']);

  // Server processing
  api.addFiles([
    'lib/contact.js',
  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:contact');
  // api.mainModule('contact-tests.js');
});
