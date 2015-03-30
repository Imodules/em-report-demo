/**
 * Created by pauls on 3/29/15.
 */

'use strict';
var pieAutoRun,
		chart,
		options;

Template.opensPieChart.destroyed = function () {
	if (pieAutoRun) { pieAutoRun.stop(); }
};

Template.opensPieChart.rendered = function () {
	chart = echarts.init(this.find('#opensPieChart'));

	pieAutoRun = Tracker.autorun(setupPieChart);
};

Template.opensPieChart.helpers({
	openData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')}),
				i=0;

		if (c) {
			for (; i < c.stats.opens.length; i++) {
				ret.total += c.stats.opens[i];
			}

			ret.pct = ((ret.total / c.totalEmails) * 100).toFixed(2);
		}

		return ret;
	},

	clickData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')}),
				i=0;

		if (c) {
			for (; i < c.stats.clicks.length; i++) {
				ret.total += c.stats.clicks[i];
			}

			ret.pct = ((ret.total / c.totalEmails) * 100).toFixed(2);
		}

		return ret;
	},

	unsubData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')}),
				i=0;

		if (c) {
			for (; i < c.stats.unsub.length; i++) {
				ret.total += c.stats.unsub[i];
			}

			ret.pct = ((ret.total / c.totalEmails) * 100).toFixed(2);
		}

		return ret;
	},

	spamData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')}),
				i=0;

		if (c) {
			for (; i < c.stats.spam.length; i++) {
				ret.total += c.stats.spam[i];
			}

			ret.pct = ((ret.total / c.totalEmails) * 100).toFixed(2);
		}

		return ret;
	},

	bounceData: function () {
		var ret = {
			pct: 0,
			total: 0
		};

		var c = Campaigns.findOne({_id: Session.get('campaignId')}),
				i=0;

		if (c) {
			for (; i < c.stats.spam.length; i++) {
				ret.total += c.stats.bounces[i];
			}

			ret.pct = ((ret.total / c.totalEmails) * 100).toFixed(2);
		}

		return ret;
	}
});

function setupPieChart() {
	if (!chart) { return; }

	var c = Campaigns.findOne({_id: Session.get('campaignId')});
	if (!c) { return; }

	if (!options) {

		options = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				x: 'left',
				data: ['Opens', 'Bounced', 'Not Opened']
			},
			calculable: true,
			color: ['#89A54E','#AA4644','#4573A7','#71588F','#4298AF','#DB843D','#93A9D0','#D09392','#A99BBE'],
			series: [
				{
					name: 'Opens',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [
						{value: 0, name: 'Opens'},
						{value: 0, name: 'Bounced'},
						{value: 0, name: 'Not Opened'}
					]
				}
			]
		};
	}

	var totalOpens = 0,
			bounces = 0,
			i = 0;

	for (; i < c.stats.opens.length; i++) {
		totalOpens += c.stats.opens[i];
		bounces += c.stats.bounces[i];
	}

	options.series[0].data[0].value = totalOpens;
	options.series[0].data[1].value = bounces;
	options.series[0].data[2].value = c.totalEmails - totalOpens - bounces;

	chart.setOption(options);
}
