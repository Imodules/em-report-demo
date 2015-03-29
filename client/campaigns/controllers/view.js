/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('ViewCampaignCtrl', ['$scope', '$meteor', '$stateParams',
	function($scope, $meteor, $stateParams){

		$scope.campaigns = $meteor.collection(Campaigns).subscribe('Campaigns');
		$scope.campaign = $meteor.object(Campaigns, $stateParams.id, false);
		$scope.campaignId = $stateParams.id;

		Session.set('campaignId', $stateParams.id);

	}]);
