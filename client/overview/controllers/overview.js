/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('OverviewCtrl', ['$scope', '$meteor',
	function($scope, $meteor){

		$scope.campaigns = $meteor.collection(function () {
			return Campaigns.find({}, {sort: {createdAt: -1}});
		}).subscribe('Campaigns');

	}]);
