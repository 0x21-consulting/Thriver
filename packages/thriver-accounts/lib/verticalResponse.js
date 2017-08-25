/**
 * @summary Collection of all Vertical Response lists to show to client
 * @type {Collection}
 */
const Lists = new Mongo.Collection(null);

/**
 * @summary Get Vertical Response Access Token
 * @type {String}
 */
let accessToken;

/**
 * @summary Publish lists on a per-user basis
 */
Meteor.publish('subscriptions', () => {
  // User must be logged in
  if (!this.userId) return [];
  console.log(arguments);
  // Get Contact ID from Vertical Response
  HTTP.get(`https://vrapi.verticalresponse.com/api/v1/contacts?email_address=${Meteor.user().emails[0].address}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }, (error, result) => {
      if (error) {
        console.log('PUBLISH SUBSCRIPTIONS Error');
        console.log(error);
        return;
      }

      if (result && result.statusCode && result.statusCode !== 200) {
        console.log('PUBLISH SUBSCRIPTIONS Result Code');
        console.log(result);
        return;
      }

      // HTTP 200 OK: Get results
      console.log('PUBLISH SUBSCRIPTIONS Results');
      console.log(JSON.parse(result));
    });

  return Lists.find();
});

/**
 * @summary Record all Vertical Response lists
 */
Meteor.startup(() => {
  accessToken = Thriver.settings.get('verticalResponse').access_token;
  if (accessToken) {
    HTTP.get('https://vrapi.verticalresponse.com/api/v1/lists/',
      { headers: { Authorization: `Bearer ${accessToken}` } }, (error, result) => {
        if (error) {
          console.log('STARTUP Error');
          console.log(error);
          return;
        }

        if (result && result.statusCode && result.statusCode !== 200) {
          console.log('STARTUP Result Code');
          console.log(result);
          return;
        }

        // HTTP 200 OK:  Store lists
        const items = JSON.parse(result.content).items;
        console.log('STARTUP ITEMS');
        for (let i = 0; i < items.length; i += 1) {
          console.log(items[i]);
          // Only include lists with public names
          if (items[i].attributes.is_public) {
            Lists.insert(items[i].attributes, (error2) => { console.log(error2); });
          } else {
            console.log('CRAP');
            console.log(items[i].attributes.public_name);
          }
        }
      });
  }
});
