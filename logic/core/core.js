import SimpleSchema from 'simpl-schema';

/**
 * @summary Global namespace for Thriver
 * @namespace Thriver
 */
Thriver = {};

Thriver.VERSION = '0.0.1-teal';

/**
 * @summary Thriver Meteor subscriptions
 * @namespace Thriver.subscriptions
 */
Thriver.subscriptions = {};

/** Extend SimpleSchema to support AutoForm */
SimpleSchema.extendOptions(['autoform']);
