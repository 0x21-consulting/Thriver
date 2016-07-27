// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by i18n.js.
import { name as packageName } from "meteor/i18n";

// Write your tests here!
// Here is an example.
Tinytest.add('i18n - example', function (test) {
  test.equal(packageName, "i18n");
});
