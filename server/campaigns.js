/**
 * Created by pauls on 3/25/15.
 */

'use strict';
Campaigns.allow({
	insert: function (userId, doc) {
		doc.createdAt = new Date();

		return true;
	},
	update: function () { return false; },
	remove: function () { return false; }
});

Meteor.publish('Campaigns', function () {
	return Campaigns.find();
});
