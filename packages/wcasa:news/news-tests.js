// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by news.js.
import { name as packageName } from "meteor/news";

// Write your tests here!
// Here is an example.
Tinytest.add('news - example', function (test) {
  test.equal(packageName, "news");
});
