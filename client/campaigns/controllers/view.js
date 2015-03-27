/**
 * Created by pauls on 3/25/15.
 */

'use strict';
angular.module('em-reporting').controller('ViewCampaignCtrl', ['$scope', '$meteor', '$stateParams',
	function($scope, $meteor, $stateParams){

		$scope.campaigns = $meteor.collection(Campaigns).subscribe('Campaigns');
		$scope.campaign = $meteor.object(Campaigns, $stateParams.id, false);

		$scope.clicks = $meteor.collection(Clicks);
		$scope.opens = $meteor.collection(Opens);

		var clickHandle;
		$meteor.subscribe('Clicks', $stateParams.id).then(function(handle) {
			clickHandle = handle;
		});

		var openHandle;
		$meteor.subscribe('Opens', $stateParams.id).then(function(handle) {
			openHandle = handle;
		});

		$scope.$on('$destroy', function() {
			clickHandle.stop();
			openHandle.stop();
		});

	}]);
