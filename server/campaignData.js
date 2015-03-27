/**
 * Created by pauls on 3/26/15.
 */

'use strict';
Meteor.publish('Opens', function (campaignId) {
	return Opens.find({campaignId: campaignId}, {fields: {campaignId: 1, timestamp: 1, postHour: 1}});
});

Meteor.publish('Clicks', function (campaignId) {
	return Clicks.find({campaignId: campaignId}, {fields: {campaignId: 1, timestamp: 1, postHour: 1}});
});
