/**
 * Created by pauls on 3/26/15.
 */

'use strict';
var chart = null,
		options = null;

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
				data : ['a','b','c','d','e','f','g']
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
				data:[10, 12, 21, 54, 260, 830, 710]
			},
			{
				name:'Clicks',
				type:'line',
				smooth:true,
				itemStyle: {normal: {areaStyle: {type: 'default'}}},
				data:[30, 182, 434, 791, 390, 30, 10]
			}
		]
	};

	// Load data into the ECharts instance
	chart.setOption(options);
}
