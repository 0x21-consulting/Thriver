/**
 * @summary Newsroom namespace
 * @namespace Thriver.newsroom
 */
Thriver.newsroom = {};

/**
 * @summary Newsroom collection
 * @type {Mongo.Collection}
 */
Thriver.newsroom.collection = new Mongo.Collection('newsroom');

/**
 * @summary Newsroom Schema
 * @type {SimpleSchema}
 */
Thriver.newsroom.schema = new SimpleSchema({
    /** ID */
    _id: {
        type: String,
        optional: true // ID is autogenerated
    },
    /** Item Title */
    title: {
        type: String,
        optional: false
    },
    /** Item Link */
    url: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Url
    },
    /** Item Publisher (like for In The News items) */
    publisher: {
        type: String,
        optional: true
    },
    /** Item Date */
    date: {
        type: Date,
        optional: false,
        defaultValue: new Date()
    },
    /** Item Type */
    type: {
        type: String,
        optional: false,
        allowedValues: [
            'actionAlert',
            'inTheNews',
            'pressRelease',
            'newsletter'
        ]
    },
    /** Item Content (like for Press Releases) */
    content: {
        type: String,
        optional: true
    }
});

// Apply schema to collection
Thriver.newsroom.collection.attachSchema(Thriver.newsroom.schema);
