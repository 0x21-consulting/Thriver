Package.describe({
  name: 'wcasa:feedback',
  version: '0.0.1',
  summary: 'Module for providing feedback in beta site',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.2');

  // Dependencies
  api.use([
    'thriver:core',
    'thriver:core-styles',
  ]);

  // Client
  api.addFiles([
    // Templates
    'lib/feedback.html',

    // Styles
    'lib/feedback.less',

    // Helpers and methods
    'lib/feedback.js',
  ], ['client']);

  // Server
  api.addFiles(['lib/server.js'], ['server']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:feedback');
  api.mainModule('feedback-tests.js');
});
