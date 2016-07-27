// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by sections.js.
import { name as packageName } from "meteor/sections";

// Write your tests here!
// Here is an example.
Tinytest.add('sections - example', function (test) {
  test.equal(packageName, "sections");
});
