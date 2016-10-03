// Structure
//   _id           {string}   auto_incr
//   title         {string}
//   type          {string}
//   content       {string}
//   url           {string}
//   publisher     {string}
//   date          {date}

// @values type
//   inTheNews
//   pressRelease
//   actionAlert

// Publish Newsroom sections -- they're public
Meteor.publish('inTheNews', function () {
    return Thriver.newsroom.collection.find({ type: 'inTheNews' }, { sort: { date: 1 }});;
});
Meteor.publish('pressReleases', function () {
    return Thriver.newsroom.collection.find({ type: 'pressRelease' }, { sort: { date: 1 }});
});
Meteor.publish('actionAlerts', function () {
    return Thriver.newsroom.collection.find({ type: 'actionAlert' }, { sort: { date: 1 }}); 
});
Meteor.publish('newsletters', function () {
    return Thriver.newsroom.collection.find({ type: 'newsletter' }, { sort: { date: 1 }}); 
});

Meteor.methods({
    /**
     * @summary Add Newsroom Item
     * @method
     *   @param {Object} item - Item to add
     */
    addNewsItem: function (item) {
        // Check authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');

        // Parameter checks
        check(item, Object);

        // Enforce UTC
        if (item.date instanceof Date)
            item.date = new Date( item.date.toISOString() );
        
        // Perform Insert
        Thriver.newsroom.collection.insert(item, function (error, id) {
            if (error) throw new Meteor.Error(error);
        });
    },
    /**
     * @summary Delete Newsroom Item
     * @method
     *   @param {String} id - ID of item to delete
     */
    deleteNewsItem: function (id) {
        // Check authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');

        // Parameter checks
        check(id, String);

        // Perform deletion
        Thriver.newsroom.collection.remove({ _id: id }, function (error) {
            if (error) throw new Meteor.Error(error);
        });
    }
});
