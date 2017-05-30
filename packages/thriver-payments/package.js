Package.describe({
  name: 'thriver:payments',
  version: '0.0.1-teal',
  summary: 'Payments support for Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Npm.depends({ 'paypal-rest-sdk': '0.6.3' });

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
    'lib/templates/donate.html',
    'lib/templates/payments.html',

    // Styles
    'lib/templates/donate.less',

    // Helpers and methods
    'lib/client/donate.js',
    'lib/client/payments.js',
  ], ['client']);

  // Client & Server processing
  api.addFiles([
    'lib/paypal.js',
  ], ['client', 'server']);

  // Server processing
  api.addFiles([
    'lib/donate.js',
  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:payments');
  // api.mainModule('payments-tests.js');
});
