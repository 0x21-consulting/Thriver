/* Notifications is already in the db schema:
However see below for proposed data schema.
Currently "type" would be equal to "template". If this gets change the view conditional will have to be updated.

var notification = [{
    type: 'action', //Would represent if an action is required. Could accept 'generic' as well.
    content: 'soandso@gmail.com has requested access to the account',
    actions: { //Only required if type is action
        action: {
            title: 'Approve',
            action: 'approveUser', //reference some type of JS/data function
        },
        action: {
            title: 'Deny',
            action: 'denyUser', //reference some type of JS/data function
        }
    }
}];

*/