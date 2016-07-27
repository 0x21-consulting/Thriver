// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by teal-core.js.
import { name as packageName } from "meteor/teal-core";

// Write your tests here!
// Here is an example.
Tinytest.add('teal-core - example', function (test) {
  test.equal(packageName, "teal-core");
});
