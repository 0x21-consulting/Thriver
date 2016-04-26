// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by escape.js.
import { name as packageName } from "meteor/escape";

// Write your tests here!
// Here is an example.
Tinytest.add('escape - example', function (test) {
  test.equal(packageName, "escape");
});
