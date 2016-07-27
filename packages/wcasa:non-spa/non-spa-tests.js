// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by non-spa.js.
import { name as packageName } from "meteor/non-spa";

// Write your tests here!
// Here is an example.
Tinytest.add('non-spa - example', function (test) {
  test.equal(packageName, "non-spa");
});
