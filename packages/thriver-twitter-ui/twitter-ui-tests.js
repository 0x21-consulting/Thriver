// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by twitter-ui.js.
import { name as packageName } from "meteor/twitter-ui";

// Write your tests here!
// Here is an example.
Tinytest.add('twitter-ui - example', function (test) {
  test.equal(packageName, "twitter-ui");
});
