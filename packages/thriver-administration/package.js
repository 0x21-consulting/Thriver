Package.describe({
  name: 'thriver:administration',
  version: '0.0.1-teal',
  summary: 'Support for administering the Thriver CMS',
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
  ]);

  // Resources
  api.addAssets([

  ], ['client']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/admin.html',

    // Styles
    'lib/templates/admin.less',

    // Helpers and methods
    'lib/client/admin.js',
    'lib/client/newActionAlert.js',
    'lib/client/newSection.js',
    'lib/client/editSection.js',
    'lib/client/deleteSection.js',
  ], ['client']);

  // Server processing
  api.addFiles([
    'lib/server.js',
  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:administration');
  // api.mainModule('administration-tests.js');
});
