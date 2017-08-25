Package.describe({
  name: 'thriver:accounts',
  version: '0.0.1-teal',
  summary: 'Accounts support for Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  // Dependencies
  api.use([
    'thriver:core',
    'thriver:core-styles',
    'accounts-password',
    'mizzao:user-status',
    'http',
  ]);

  // Schema
  api.addFiles([
    'lib/schema.js',
  ], ['client', 'server']);

  // Resources
  api.addAssets([

  ], ['client']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/events.html',
    'lib/templates/notifications.html',
    'lib/templates/profile.html',
    'lib/templates/register.html',
    'lib/templates/requests.html',
    'lib/templates/signin.html',
    'lib/templates/subscriptions.html',

    // Styles
    'lib/templates/user.less',

    // Helpers and methods
    'lib/client/user.js',
    'lib/client/events.js',
    'lib/client/notifications.js',
    'lib/client/profile.js',
    'lib/client/register.js',
    'lib/client/requests.js',
    'lib/client/signin.js',
    'lib/client/subscriptions.js',
  ], ['client']);

  // Server processing
  api.addFiles([
    'lib/accounts.js',
    'lib/notifications.js',
    'lib/verticalResponse.js',
  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:accounts');
  // api.mainModule('accounts-tests.js');
});
