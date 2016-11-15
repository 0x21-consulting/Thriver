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
<<<<<<< 552e97182737d33feb113b04edbf2edb36ed1386
<<<<<<< eb233c9491142f69284ddd6b01c3f06caaff5f41

  // Schema
  api.addFiles(['lib/schema.js'], ['client', 'server']);
=======
>>>>>>> Created feedback package, feedback icon, and feedback form.
=======

  // Schema
  api.addFiles(['lib/schema.js'], ['client', 'server']);
>>>>>>> Created feedback schema, collection, namespace, publish method, and add method. Allows for submitting comments and pairing them with an element on the page.
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wcasa:feedback');
  api.mainModule('feedback-tests.js');
});
