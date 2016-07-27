// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by who-we-are.js.
import { name as packageName } from "meteor/who-we-are";

// Write your tests here!
// Here is an example.
Tinytest.add('who-we-are - example', function (test) {
  test.equal(packageName, "who-we-are");
});
