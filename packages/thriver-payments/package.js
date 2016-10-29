Package.describe({
  name: 'thriver:payments',
  version: '0.0.1-teal',
  summary: 'Payments support for Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  // Dependencies
  api.use([
    'thriver:core',
    'thriver:core-styles',
    'mrt:paypal@=1.1.1',
  ]);

  // Resources
  api.addAssets([

  ], ['client']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/donate.html',

    // Styles
    'lib/templates/donate.less',

    // Helpers and methods
    'lib/client/donate.js',
  ], ['client']);

    // Server processing
  api.addFiles([

  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:payments');
  // api.mainModule('payments-tests.js');
});
