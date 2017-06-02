Package.describe({
  name: 'thriver:core',
  version: '0.0.1-teal',
  summary: 'Core Libraries and Resources for the Thriver CMS',
  git: 'https://github.com/enove/Thriver.git',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('METEOR@1.0');

  const packages = [
    'ecmascript',                 // javascript
    'mongo',                      // database
    'reactive-var',               // Support for reactive variables

    'templating',                 // Allow templates
    'spacebars',                  // Template Syntax
    'blaze-html-templates',       // Reactive templates
    'iron:router@1.0.13',         // Template routing

    'sha',                        // SHA Hash support
    'gwendall:body-events',       // Support Meteor.body.events

    'check',                      // Check library
    'audit-argument-checks',      // Enforce Check

    'aldeed:collection2@2.9.1',   // Enforce schemas on collections
    'aldeed:autoform@5.8.1',      // Enforce schemas on forms
  ];

  api.use(packages);
  api.imply(packages);

  api.addAssets([], 'client');

  api.addFiles([
    'lib/core.js',
    'lib/settings.js',
  ], ['client', 'server']);

  api.addFiles([
    // Templates
    'lib/templates/head.html',
    'lib/templates/canvas.html',
    'lib/templates/browseHappy.html',

    // Client scripts
    'lib/client/shims.js',
    'lib/client/marked.js',
    'lib/client/markdown.js',
    'lib/client/history.js',
    'lib/client/scroll.js',
    'lib/client/canvas.js',

    // UI Scripts
    'lib/client/ui/actions.js',
    'lib/client/ui/focus.js',
    'lib/client/ui/helpers-script.js',
    'lib/client/ui/helpers-spacebars.js',
  ], ['client']);

  // Add iron routing
  api.addFiles(['lib/router.js'], ['client', 'server']);

  api.addFiles([
    // File download support
    'lib/files.js',
  ], ['server']);

  api.export(['Thriver']);
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thriver:core');
  // api.mainModule('core-tests.js');
});
