// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by masthead.js.
import { name as packageName } from "meteor/masthead";

// Write your tests here!
// Here is an example.
Tinytest.add('masthead - example', function (test) {
  test.equal(packageName, "masthead");
});
