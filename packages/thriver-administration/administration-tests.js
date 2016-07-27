// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by administration.js.
import { name as packageName } from "meteor/administration";

// Write your tests here!
// Here is an example.
Tinytest.add('administration - example', function (test) {
  test.equal(packageName, "administration");
});
