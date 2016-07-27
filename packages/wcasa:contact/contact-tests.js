// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by contact.js.
import { name as packageName } from "meteor/contact";

// Write your tests here!
// Here is an example.
Tinytest.add('contact - example', function (test) {
  test.equal(packageName, "contact");
});
