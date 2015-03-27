/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	function($urlRouterProvider, $stateProvider, $locationProvider){

		$locationProvider.html5Mode(true);

		$stateProvider
				.state('overview', {
					url: '/overview',
					templateUrl: 'client/overview/views/overview.ng.html',
					controller: 'OverviewCtrl'
				})
				.state('createCampaign', {
					url: '/campaigns/create',
					templateUrl: 'client/campaigns/views/createCampaign.ng.html',
					controller: 'CreateCampaignCtrl'
				})
				.state('viewCampaign', {
					url: '/campaigns/:id',
					templateUrl: 'client/campaigns/views/viewCampaign.ng.html',
					controller: 'ViewCampaignCtrl'
				});

		$urlRouterProvider.otherwise('/overview');
	}]);
