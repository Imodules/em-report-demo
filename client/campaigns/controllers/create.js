/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('CreateCampaignCtrl', ['$scope', '$meteor',
	function($scope, $meteor){

		$scope.campaigns = $meteor.collection(Campaigns).subscribe('Campaigns');

		$scope.create = function() {
			$scope.campaign.createdAt = new Date();
			$scope.campaigns.push($scope.campaign).then(function (id) {
				console.log(id);
			});

		};

	}]);
