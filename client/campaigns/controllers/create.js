/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('CreateCampaignCtrl', ['$scope', '$stateParams',
	function($scope, $stateParams){

		$scope.campaign = {};

		$scope.create = function() {
			console.log($scope.campaign);
		};

	}]);
