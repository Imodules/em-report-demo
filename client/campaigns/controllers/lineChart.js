/**
 * Created by pauls on 3/26/15.
 */

'use strict';
var chart = null,
		options = null,
		campaignsHandle = null,
		createdAt = null,
		clicksAutoRun = null,
		opensAutoRun = null;

Template.lineChart.created = function () {
	campaignsHandle = Meteor.subscribe('Campaigns');
};

Template.lineChart.destroyed = function () {
	if (campaignsHandle) { campaignsHandle.stop(); }

	if (clicksAutoRun) { clicksAutoRun.stop(); }
	if (opensAutoRun) { opensAutoRun.stop(); }
};

Template.lineChart.rendered = function () {
	chart = echarts.init(this.find('#lineChart'));

	clicksAutoRun = Tracker.autorun(setupLineChart);
};

Template.lineChart.helpers({
	isLoaded: function () {
		return handlesReady();
	}
});

function setupLineChart() {
	if (!chart) { return; }

	var c = Campaigns.findOne({_id: Session.get('campaignId')});
	if (!c) { return; }

	var xAxisData = [],
			i = 0;

	createdAt = moment(c.createdAt).minutes(0).seconds(0);

	for (; i<48; i++) {
		var idxDate = moment(createdAt);
		idxDate.add(i, 'h').minute(0).second(0);
		xAxisData[i] = idxDate.format('dddd, MMMM Do YYYY, h a');
	}

	if (!options) {

		options = {
			color: ['#4573A7','#AA4644','#89A54E','#71588F','#4298AF','#DB843D','#93A9D0','#D09392','#A99BBE'],
			tooltip : {
				trigger: 'axis'
			},
			loadingOption: {
				text: 'Loading...',
				effect: 'effect'
			},
			noDataLoadingOption: {
				text: 'No Data',
				effect: 'effect'
			},
			legend: {
				data: ['Opens', 'Clicks']
			},
			toolbox: {
				show: false
			},
			calculable: true,
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				data : xAxisData
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: 'Opens',
					type: 'line',
					smooth: true,
					itemStyle: {normal: {areaStyle: {type: 'default'}}},
					data: []
				},
				{
					name: 'Clicks',
					type: 'line',
					smooth: true,
					itemStyle: {normal: {areaStyle: {type: 'default'}}},
					data: []
				}
			]
		};
	}

	options.series[0].data = c.stats.opens;
	options.series[1].data = c.stats.clicks;
	chart.setOption(options);
}

function handlesReady() {
	return campaignsHandle.ready();
}
