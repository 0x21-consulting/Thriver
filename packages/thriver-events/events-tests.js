// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by events.js.
import { name as packageName } from "meteor/events";

// Write your tests here!
// Here is an example.
Tinytest.add('events - example', function (test) {
  test.equal(packageName, "events");
});
