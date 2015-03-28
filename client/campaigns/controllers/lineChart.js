/**
 * Created by pauls on 3/26/15.
 */

'use strict';
var chart = null,
		options = null,
		clicksHandle = null,
		opensHandle = null;

Template.lineChart.created = function () {
	clicksHandle = Meteor.subscribe('Clicks', Session.get('campaignId'));
	opensHandle = Meteor.subscribe('Opens', Session.get('campaignId'));
};

Template.lineChart.destroyed = function () {
	if (clicksHandle) { clicksHandle.stop(); }
	if (opensHandle) { opensHandle.stop(); }
};

Template.lineChart.rendered = function () {
	setupLineChart(this);
};

function setupLineChart(t) {
	chart = echarts.init(t.find('#lineChart'));

	options = {
		//title : {
		//	text: '某楼盘销售情况',
		//	subtext: '纯属虚构'
		//},
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
				data : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
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
		var data = getData(Clicks.find({}, {sort: {postHour: 1}}));
		if (options) {
			options.series[1].data = data.array;
			chart.setOption(options);
		}

		return data.total;
	},

	opens: function () {
		var data = getData(Opens.find({}, {sort: {postHour: 1}}));
		if (options) {
			options.series[0].data = data.array;
			chart.setOption(options);
		}
		return data.total;
	}
});

function getData(c) {
	var data = {total: 0, array: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};

	c.forEach(function (d) {
		data.total++;
		data.array[d.postHour]++;
	});

	return data;
}

//function getData(c) {
//	var clicks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//			opens = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//
//	Clicks.find({}, {sort: {postHour: 1}}).forEach(function (click) {
//		clicks[click.postHour]++;
//	});
//
//	Opens.find({}, {sort: {postHour: 1}}).forEach(function (open) {
//		opens[open.postHour]++;
//	});
//
//	console.log(opens);
//
//	if (options === null) return;
//	options.series[0].data = opens;
//	options.series[1].data = clicks;
//
//	chart.setOption(options);
//}
