/**
 * Created by pauls on 3/26/15.
 */

'use strict';
var chart = null,
		options = null,
		campaignsHandle = null,
		clicksHandle = null,
		opensHandle = null,
		createdAt = null;

Template.lineChart.created = function () {
	campaignsHandle = Meteor.subscribe('Campaigns');
	clicksHandle = Meteor.subscribe('Clicks', Session.get('campaignId'));
	opensHandle = Meteor.subscribe('Opens', Session.get('campaignId'));
};

Template.lineChart.destroyed = function () {
	if (campaignsHandle) { campaignsHandle.stop(); }
	if (clicksHandle) { clicksHandle.stop(); }
	if (opensHandle) { opensHandle.stop(); }
};

Template.lineChart.rendered = function () {
	chart = echarts.init(this.find('#lineChart'));
	//setupLineChart(this);
};

function setupLineChart(t) {
	if (!chart) { return; }

	var c = Campaigns.findOne({_id: Session.get('campaignId')});
	if (!c) { return; }

	createdAt = moment(c.createdAt);

	var xAxisData = [],
			i = 0;

	for (; i<24; i++) {
		var idxDate = moment(createdAt)
		idxDate.add(i, 'h').minute(0).second(0);
		xAxisData[i] = idxDate.format('dddd, MMMM Do YYYY, h a');
	}

	console.log(xAxisData);

	options = {
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['Opens', 'Clicks']
		},
		toolbox: {
			show : false
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				data : xAxisData
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'Opens',
				type:'line',
				smooth:true,
				itemStyle: {normal: {areaStyle: {type: 'default'}}},
				data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			},
			{
				name:'Clicks',
				type:'line',
				smooth:true,
				itemStyle: {normal: {areaStyle: {type: 'default'}}},
				data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			}
		]
	};

	// Load data into the ECharts instance
	chart.setOption(options);
}

Template.lineChart.helpers({
	clicks: function () {
		var data = getData(Clicks.find({}, {sort: {chartPostDate: 1}}));
		if (options && handlesReady()) {
			options.series[1].data = data.array;
			chart.setOption(options);
		}

		return data.total;
	},

	opens: function () {
		var data = getData(Opens.find({}, {sort: {chartPostDate: 1}}));
		if (options && handlesReady()) {
			options.series[0].data = data.array;
			chart.setOption(options);
		}
		return data.total;
	}
});

function getData(c) {
	if (createdAt === null) {
		setupLineChart();
	}

	var data = {total: 0, array: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};

	c.forEach(function (d) {
		data.total++;

		var diff = -createdAt.diff(d.chartPostDate, 'hours');
		console.log(diff);

		data.array[diff]++;
	});

	return data;
}

function handlesReady() {
	return campaignsHandle.ready() && opensHandle.ready() && clicksHandle.ready();
}
