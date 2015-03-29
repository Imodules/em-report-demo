/**
 * Created by pauls on 3/29/15.
 */

'use strict';
Template.opensPieChart.helpers({
	openData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')});

		ret.total = Opens.find({}).count();

		if (c) {
			ret.pct = (ret.total / c.totalEmails).toFixed(2);
		}

		return ret;
	},

	clickData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')});

		ret.total = Clicks.find({}).count();

		if (c) {
			ret.pct = (ret.total / c.totalEmails).toFixed(2);
		}

		return ret;
	}
});
