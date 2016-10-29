Package.describe({
  name: 'wcasa:work',
  version: '0.0.1-teal',
  summary: 'Work Section for the WCASA Implementation of Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  // Dependencies
  api.use([
    'thriver:core',
    'thriver:core-styles',
    'thriver:sections',
  ]);

  // Resources
  api.addAssets([

  ], ['client']);

  // Client processing
  api.addFiles([
    // Templates
    'lib/templates/work.html',

    // Styles
    'lib/templates/work.less',

    // Helpers and methods
    'lib/client/sticky.js',
    'lib/client/work.js',

    // Administration
    'lib/client/admin.js',
  ], ['client']);

  // Server processing
  api.addFiles([

  ], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:work');
  // api.mainModule('work-tests.js');
});
