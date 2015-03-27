/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('ViewCampaignCtrl', ['$scope', '$meteor', '$stateParams',
	function($scope, $meteor, $stateParams){

		$scope.campaigns = $meteor.collection(Campaigns).subscribe('Campaigns');
		$scope.campaign = $meteor.object(Campaigns, $stateParams.id, false);

		$scope.clicks = $meteor.collection(Clicks).subscribe('Clicks', $stateParams.id);
		$scope.opens = $meteor.collection(Opens).subscribe('Opens', $stateParams.id);

	}]);
